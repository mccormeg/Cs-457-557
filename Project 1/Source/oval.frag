#version 330 compatibility

in float vLightIntensity;
in vec2  vST;

uniform float uAd;
uniform float uBd;
uniform float uTol;

const vec3 RED = vec3(1.,0.,0.);
const vec3 YELLOW = vec3(1.,.86,0.);

void
main( )
{
	float Ar = uAd/2.;
	float Br = uBd/2.;
	int numins = int ( vST.s / uAd );
	int numint = int ( vST.t / uBd );
	float sc = numins * uAd + Ar;
	float tc = numint *uBd + Br;

	float ellipse = (pow(vST.s - sc,2)/pow(Ar,2))+(pow(vST.t - tc,2)/pow(Br,2));

	float d = smoothstep( 1. - uTol, 1. + uTol, ellipse );
	vec3 rgb = vLightIntensity * mix( RED, YELLOW , d );
	gl_FragColor = vec4( rgb, 1. );
}
