#version 330 compatibility

in vec3 Nf;
in vec3 Ns;
in vec3 Lf;
in vec3 Ls;
in vec3 Ef;
in vec3 Es;
in vec3 vMC;

uniform float uKa, uKd, uKs;

uniform vec4 uColor;
uniform vec4 uSpecularColor;

uniform float uShininess;


uniform float uA,uB, uC, uD;

uniform float uNoiseAmp, uNoiseFreq;

uniform sampler3D Noise3;

uniform float uEta;

uniform float uMix;
uniform samplerCube uReflectUnit;
uniform samplerCube uRefractUnit;
const vec4 WHITE = vec4( 1.,1.,1.,1. );

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
	vec4 nvx = texture( Noise3, uNoiseFreq*vMC );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	angx *= uNoiseAmp;

    vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	angy *= uNoiseAmp;

	vec3 Normal;
    vec3 Light;
	vec3 Eye;

	Normal = RotateNormal(angx,angy,Ns);
    Light = normalize(Ls);
	Eye = normalize(Es);
    
    vec3 vRefractVector = refract( Eye, Normal, uEta );
	vec3 vReflectVector = reflect( Eye, Normal );

    vec4 refractcolor = textureCube( uRefractUnit, vRefractVector );
    vec4 reflectcolor = textureCube( uReflectUnit, vReflectVector );
    refractcolor = mix( refractcolor, WHITE, .40 );
    gl_FragColor = vec4( mix( refractcolor, reflectcolor, uMix ).rgb, 1. );
	
}