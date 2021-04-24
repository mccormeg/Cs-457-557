#version 330 compatibility

in vec3 Nf;
in vec3 Ns;
in vec3 Lf;
in vec3 Ls;
in vec3 Ef;
in vec3 Es;
in vec3 vMC;

uniform float uKa, uKd, uKs,uKr;

uniform vec4 uColor;
uniform vec4 uSpecularColor;

uniform float uShininess;


uniform float uA,uB, uC, uD;

uniform float uNoiseAmp, uNoiseFreq;

uniform sampler3D Noise3;
uniform samplerCube uReflectUnit;

vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}

void
main( )
{
	//Create sparkles using Noise
	vec4 nvx = texture( Noise3, 40*vMC);
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	angx *= 10;

    vec4 nvy = texture( Noise3, 40*vec3(vMC.xy,vMC.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	angy *= 10;

	vec3 Normal;
	vec3 Light;
	vec3 Eye;

	Normal = RotateNormal(cos(angx),cos(angy),Ns);
	Light = normalize(Ls);
	Eye = normalize(Es);

	vec4 ambient = uKa * uColor;

	float d = max( dot(Normal,Light), 0. );
	vec4 diffuse = uKd * d * uColor;
	vec3 R = normalize( reflect( -Light, Normal ) );
	float s = 0.;
	if( dot(Normal,Light) > 0. )		// only do specular if the light can see the point
	{
		vec3 ref = normalize( 2. * Normal * dot(Normal,Light) - Light );
		s = pow( max( dot(Eye,R),0. ), 10 );
	}
	//Use reflect in lighing for a very shinny look
	vec4 specular = uKs * s * uSpecularColor;
	vec3 reflcolor = textureCube( uReflectUnit, R ).rgb;
	gl_FragColor = vec4( ambient.rgb + diffuse.rgb + specular.rgb + uKr*reflcolor.rgb, 1. );
}