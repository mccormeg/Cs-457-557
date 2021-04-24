#version 330 compatibility

in vec2 vST;

uniform sampler2D uImageUnit;
uniform float uScenter;
uniform float uTcenter;
uniform float uRadius;
uniform float uMagFactor;
uniform float uRotAngle;
uniform float uSharpFactor;

void
main( )
{
	ivec2 ires = textureSize( uImageUnit, 0 );
	float ResS = float( ires.s );
	float ResT = float( ires.t );
	
	//Look for fragment inside lense
	vec2 lenST = vec2(uScenter,uTcenter);
	if (sqrt(pow(uScenter - vST.s,2)+pow(uTcenter - vST.t,2)) <= uRadius){
		//Magnify
		vec2 magST = (lenST - vST)*uMagFactor;
		//Rotate
		vec2 rotST = magST + lenST + vec2((vST.s - uScenter)*cos(uRotAngle) - (vST.t -uTcenter)*sin(uRotAngle),(vST.s -uScenter)*sin(uRotAngle) + (vST.t -uTcenter)*cos(uRotAngle));
		//Sharpen
		vec2 stp0 = vec2(1./ResS, 0. );
		vec2 st0p = vec2(0. , 1./ResT);
		vec2 stpp = vec2(1./ResS, 1./ResT);
		vec2 stpm = vec2(1./ResS, -1./ResT);
		vec3 i00 = texture2D( uImageUnit, rotST ).rgb;
		vec3 im1m1 = texture2D( uImageUnit, rotST-stpp ).rgb;
		vec3 ip1p1 = texture2D( uImageUnit, rotST+stpp ).rgb;
		vec3 im1p1 = texture2D( uImageUnit, rotST-stpm ).rgb;
		vec3 ip1m1 = texture2D( uImageUnit, rotST+stpm ).rgb;
		vec3 im10 = texture2D( uImageUnit, rotST-stp0 ).rgb;
		vec3 ip10 = texture2D( uImageUnit, rotST+stp0 ).rgb;
		vec3 i0m1 = texture2D( uImageUnit, rotST-st0p ).rgb;
		vec3 i0p1 = texture2D( uImageUnit, rotST+st0p ).rgb;
		vec3 target = vec3(0.,0.,0.);
		target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
		target += 2.*(im10+ip10+i0m1+i0p1);
		target += 4.*(i00);
		target /= 16.;
		gl_FragColor = vec4( mix( target, texture(uImageUnit,rotST).rgb, uSharpFactor ), 1. );
	}
	else{
		gl_FragColor = texture(uImageUnit,vST);
	}
	
}