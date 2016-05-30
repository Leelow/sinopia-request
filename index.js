const _request = require( 'request' );
const crypto = require( 'crypto' );

function SinopiaRequest( config, sinopia ) {

    var base_options = {
        method: config.method,
        header: {
            'Content-Type': 'application/json',
            'User-Agent': sinopia.config.user_agent
        }
    };

    var encrypt;
    switch ( config.password_encrypt ) {
        case 'sha1':
            encrypt = function ( str ) {
                return crypto.createHash( 'sha1' ).update( str ).digest( 'hex' );
            };
            break;
        default:
            encrypt = function ( str ) {
                return str;
            };
    }

    console.log('sinopia-request plugin loaded.');

    var request = function ( user, password, route, callback ) {

        var options = base_options;
        options.url = (sinopia.config.https.enable ? 'https' : 'http') + '://' + config.host + (config.port ? ':' + config.port : '') + route;
        options.json = {
            user: user,
            password: encrypt( password )
        };

        _request( options, function ( err, res, body ) {

            if ( err ) {
                err.status = 500;
                return callback( err );
            }
            else if ( body === undefined || body.result === undefined ) {
                err = new Error( 'Bad server response.' );
                err.status = 500;
                return callback( err );
            }
            else
                return callback( null, body.result );

        } );

    };

    this.adduser = function ( user, password, callback ) {
        return request( user, encrypt( password ), config.adduser_route, callback );
    };

    this.authenticate = function ( user, password, callback ) {
        request( user, encrypt( password ), config.authenticate_route, function ( err, res ) {
            if ( err )
                return callback( err );
            else if ( !res )
                return callback( null, false );
            else
                return callback( null, user );
        } );
    };

}

module.exports = function ( config, stuff ) {
    return new SinopiaRequest( config, stuff );
};