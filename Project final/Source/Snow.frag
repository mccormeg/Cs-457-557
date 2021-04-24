#version 330 compatibility

in vec3 Nf;
in vec3 Ns;
in vec3 Lf;
in vec3 Ls;
in vec3 Ef;
in vec3 Es;
in vec3 vMC;


in vec2 vST;




uniform float uif;
uniform float uelseif;
uniform float uelse;
uniform samplerCube uRefractUnit;
uniform samplerCube uReflectUnit;
uniform float uMix;
const vec4 BLUE = vec4( 0.4, .8, 1., 1. );
uniform sampler2D uNormalTex;
uniform sampler2D uColorTex;

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
	float refin;

	vec3 Normal;
	vec3 Light;
	vec3 Eye;
	
	Normal = normalize ((texture2D(uNormalTex,vST.st).xyz*2.0 - 1.0));
	Light = normalize(Ls);
	Eye = normalize(Es);
	 if ( texture2D(uColorTex,vST.st).b > .99){
		discard; 
	 }
	 if ((texture2D(uNormalTex,vST.st).r)> .9){
		refin = uif;
	 }
	 else if ((texture2D(uNormalTex,vST.st).r)> .6){
		refin = uelseif;
	 }
	 else{
		refin = uelse;
	 }
    vec3 vRefractVector = refract( Eye, Normal, refin );
	vec3 vReflectVector = reflect( Eye, Normal );

    vec4 refractcolor = textureCube( uRefractUnit, vRefractVector );
    vec4 reflectcolor = textureCube( uReflectUnit, vReflectVector );
    refractcolor = mix( refractcolor, BLUE, .40 );
    gl_FragColor = vec4( mix( refractcolor, reflectcolor, uMix ).rgb, 1. );

	//vec4 ambient = vec4( newcolor,1);

	//float d = max( dot(Normal,Light), 0. );
	//vec4 diffuse =  d *  vec4( newcolor,1);
	//vec3 R = normalize( reflect( -Light, Normal ) );
	//float s = 0.;
	//if( dot(Normal,Light) > 0. )		// only do specular if the light can see the point
	//{
		//vec3 ref = normalize( 2. * Normal * dot(Normal,Light) - Light );
		//s = pow( max( dot(Eye,R),0. ), 10 );
	//}
	//Use reflect in lighing for a very shinny look
	//vec4 specular =  s * BLUE;
//	vec3 reflcolor = textureCube( uReflectUnit, R ).rgb;
	//gl_FragColor = vec4( ambient.rgb + diffuse.rgb + specular.rgb + uKr*reflcolor.rgb, 1. );
}