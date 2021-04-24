#version 330 compatibility

uniform float uLightX, uLightY, uLightZ;

uniform float uA,uB, uC, uD;
const float PI = 3.1415;

vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );

out vec3 Ns;
out vec3 Nf;
out vec3 Ls;
out vec3 Lf;
out vec3 Ef;
out vec3 Es;
out vec3 vMC;


void
main( )
{ 
	float r = sqrt( (gl_Vertex.x*gl_Vertex.x)+ (gl_Vertex.y * gl_Vertex.y));
	float z = uA * (cos(2*PI*uB*r+uC)*exp(-uD*r));
	float dzdr = uA * (-sin(2.*PI*uB*r+uC) * 2.*PI*uB * exp(-uD*r) + cos(2.*PI*uB*r+uC) * -uD * exp(-uD*r) );
	float drdx = gl_Vertex.x/r;
	float drdy = gl_Vertex.y/r;
	float dzdx = dzdr * drdx;
	float dzdy = dzdr * drdy;

	vec3 Tx = vec3(1., 0., dzdx );
	vec3 Ty = vec3(0., 1., dzdy );

	vec4 ECposition = gl_ModelViewMatrix * gl_Vertex;

	Nf = normalize(cross( Tx, Ty ) );	// surface normal vector
	Ns = Nf;

	Lf = eyeLightPosition - ECposition.xyz;		// vector from the point
									// to the light position
	Ls = Lf;
	Ef = vec3( 0., 0., 0. ) - ECposition.xyz;		// vector from the point
									// to the eye position 
	Es = Ef;
	vMC = vec3(gl_Vertex.x,gl_Vertex.y,z);
	vec4 vMC4 = vec4(gl_Vertex.x,gl_Vertex.y,z,gl_Vertex.w);
	gl_Position = gl_ModelViewProjectionMatrix * vMC4;
}