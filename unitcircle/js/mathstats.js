
var MathStats = function()
{
	var msMin	= 100;
	var msMax	= 0;

	var container	= document.createElement( 'div' );
	container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';

	var msDiv	= document.createElement( 'div' );
	msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#200;';
	container.appendChild( msDiv );

	var msText	= document.createElement( 'div' );
	msText.style.cssText = 'color:#f00;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	msText.innerHTML= 'Values';
	msDiv.appendChild( msText );

	var msTexts	= [];
	var nLines	= 3;

	for(var i = 0; i < nLines; i++)
	{
		msTexts[i]	= document.createElement( 'div' );
		msTexts[i].style.cssText = 'color:#f00;background-color:#311;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
		msDiv.appendChild( msTexts[i] );		
		msTexts[i].innerHTML= '-';
	}

	return {
		domElement: container,

		update: function(webGLRenderer, sin, cos, tan)
		{
			// sanity check
			console.assert(webGLRenderer instanceof THREE.WebGLRenderer)

			var i	= 0;
			msTexts[i++].textContent = "sin: " + sin;
			msTexts[i++].textContent = "cos: " + cos;
			msTexts[i++].textContent = "tan: " + tan;
		}
	}	
}

