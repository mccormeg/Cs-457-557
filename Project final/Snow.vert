#version 330 compatibility



const float PI = 3.1415;

vec3 eyeLightPosition = vec3( 10, 10, 20 );

out vec3 Ns;
out vec3 Nf;
out vec3 Ls;
out vec3 Lf;
out vec3 Ef;
out vec3 Es;
out vec3 vMC;

out vec2 vST;

void
main( )
{ 
	vST = gl_MultiTexCoord0.st;
	vec4 ECposition = gl_ModelViewMatrix * gl_Vertex;

	Nf = normalize( gl_NormalMatrix * gl_Normal );
	Ns = Nf;

	Lf = eyeLightPosition - ECposition.xyz;		// vector from the point
									// to the light position
	Ls = Lf;
	Ef = vec3( 0., 0., 0. ) - ECposition.xyz;		// vector from the point
									// to the eye position 
	Es = Ef;
	vMC = gl_Vertex.xyz;
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}