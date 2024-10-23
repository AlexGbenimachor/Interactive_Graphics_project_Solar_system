<!DOCTYPE html>
<!-- saved from url=(0091)https://threejsdoc.appspot.com/doc/three.js/src.source/extras/controls/RollControls.js.html -->
<html><head><meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
  <title>doc/three.js/src/extras/controls/RollControls.js</title>
  <link rel="stylesheet" type="text/css" href="./RollControls_files/github.css">
  <link rel="stylesheet" type="text/css" href="./RollControls_files/find.css">
  <script src="./RollControls_files/highlight.pack.js"></script>
  <script>
    hljs.initHighlightingOnLoad()
  </script>
  <script src="./RollControls_files/find.js"></script>
</head>
<body data-pinterest-extension-installed="cr2.0.5">
<pre><code class="js javascript"><span class="comment">/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */</span>

THREE.RollControls = <span class="function"><span class="keyword">function</span> <span class="params">( object, domElement )</span> {</span>

	<span class="keyword">this</span>.object = object;
	<span class="keyword">this</span>.domElement = ( domElement !== undefined ) ? domElement : document;

	<span class="comment">// API</span>

	<span class="keyword">this</span>.mouseLook = <span class="literal">true</span>;
	<span class="keyword">this</span>.autoForward = <span class="literal">false</span>;

	<span class="keyword">this</span>.lookSpeed = <span class="number">1</span>;
	<span class="keyword">this</span>.movementSpeed = <span class="number">1</span>;
	<span class="keyword">this</span>.rollSpeed = <span class="number">1</span>;

	<span class="keyword">this</span>.constrainVertical = [ -<span class="number">0.9</span>, <span class="number">0.9</span> ];

	<span class="comment">// disable default target object behavior</span>

	<span class="keyword">this</span>.object.matrixAutoUpdate = <span class="literal">false</span>;

	<span class="comment">// internals</span>

	<span class="keyword">this</span>.forward = <span class="keyword">new</span> THREE.Vector3( <span class="number">0</span>, <span class="number">0</span>, <span class="number">1</span> );
	<span class="keyword">this</span>.roll = <span class="number">0</span>;

	<span class="keyword">var</span> xTemp = <span class="keyword">new</span> THREE.Vector3();
	<span class="keyword">var</span> yTemp = <span class="keyword">new</span> THREE.Vector3();
	<span class="keyword">var</span> zTemp = <span class="keyword">new</span> THREE.Vector3();
	<span class="keyword">var</span> rollMatrix = <span class="keyword">new</span> THREE.Matrix4();

	<span class="keyword">var</span> doRoll = <span class="literal">false</span>, rollDirection = <span class="number">1</span>, forwardSpeed = <span class="number">0</span>, sideSpeed = <span class="number">0</span>, upSpeed = <span class="number">0</span>;

	<span class="keyword">var</span> mouseX = <span class="number">0</span>, mouseY = <span class="number">0</span>;

	<span class="keyword">var</span> windowHalfX = window.innerWidth / <span class="number">2</span>;
	<span class="keyword">var</span> windowHalfY = window.innerHeight / <span class="number">2</span>;

	<span class="comment">// custom update</span>

	<span class="keyword">this</span>.update = <span class="function"><span class="keyword">function</span> <span class="params">( delta )</span> {</span>

		<span class="keyword">if</span> ( <span class="keyword">this</span>.mouseLook ) {

			<span class="keyword">var</span> actualLookSpeed = delta * <span class="keyword">this</span>.lookSpeed;

			<span class="keyword">this</span>.rotateHorizontally( actualLookSpeed * mouseX );
			<span class="keyword">this</span>.rotateVertically( actualLookSpeed * mouseY );

		}

		<span class="keyword">var</span> actualSpeed = delta * <span class="keyword">this</span>.movementSpeed;
		<span class="keyword">var</span> forwardOrAuto = ( forwardSpeed &gt; <span class="number">0</span> || ( <span class="keyword">this</span>.autoForward &amp;&amp; ! ( forwardSpeed &lt; <span class="number">0</span> ) ) ) ? <span class="number">1</span> : forwardSpeed;

		<span class="keyword">this</span>.object.translateZ( -actualSpeed * forwardOrAuto );
		<span class="keyword">this</span>.object.translateX( actualSpeed * sideSpeed );
		<span class="keyword">this</span>.object.translateY( actualSpeed * upSpeed );

		<span class="keyword">if</span>( doRoll ) {

			<span class="keyword">this</span>.roll += <span class="keyword">this</span>.rollSpeed * delta * rollDirection;

		}

		<span class="comment">// cap forward up / down</span>

		<span class="keyword">if</span>( <span class="keyword">this</span>.forward.y &gt; <span class="keyword">this</span>.constrainVertical[ <span class="number">1</span> ] ) {

			<span class="keyword">this</span>.forward.y = <span class="keyword">this</span>.constrainVertical[ <span class="number">1</span> ];
			<span class="keyword">this</span>.forward.normalize();

		} <span class="keyword">else</span> <span class="keyword">if</span>( <span class="keyword">this</span>.forward.y &lt; <span class="keyword">this</span>.constrainVertical[ <span class="number">0</span> ] ) {

			<span class="keyword">this</span>.forward.y = <span class="keyword">this</span>.constrainVertical[ <span class="number">0</span> ];
			<span class="keyword">this</span>.forward.normalize();

		}


		<span class="comment">// construct unrolled camera matrix</span>

		zTemp.copy( <span class="keyword">this</span>.forward );
		yTemp.set( <span class="number">0</span>, <span class="number">1</span>, <span class="number">0</span> );

		xTemp.cross( yTemp, zTemp ).normalize();
		yTemp.cross( zTemp, xTemp ).normalize();

		<span class="keyword">this</span>.object.matrix.n11 = xTemp.x; <span class="keyword">this</span>.object.matrix.n12 = yTemp.x; <span class="keyword">this</span>.object.matrix.n13 = zTemp.x;
		<span class="keyword">this</span>.object.matrix.n21 = xTemp.y; <span class="keyword">this</span>.object.matrix.n22 = yTemp.y; <span class="keyword">this</span>.object.matrix.n23 = zTemp.y;
		<span class="keyword">this</span>.object.matrix.n31 = xTemp.z; <span class="keyword">this</span>.object.matrix.n32 = yTemp.z; <span class="keyword">this</span>.object.matrix.n33 = zTemp.z;

		<span class="comment">// calculate roll matrix</span>

		rollMatrix.identity();
		rollMatrix.n11 = Math.cos( <span class="keyword">this</span>.roll ); rollMatrix.n12 = -Math.sin( <span class="keyword">this</span>.roll );
		rollMatrix.n21 = Math.sin( <span class="keyword">this</span>.roll ); rollMatrix.n22 =  Math.cos( <span class="keyword">this</span>.roll );

		<span class="comment">// multiply camera with roll</span>

		<span class="keyword">this</span>.object.matrix.multiplySelf( rollMatrix );
		<span class="keyword">this</span>.object.matrixWorldNeedsUpdate = <span class="literal">true</span>;

		<span class="comment">// set position</span>

		<span class="keyword">this</span>.object.matrix.n14 = <span class="keyword">this</span>.object.position.x;
		<span class="keyword">this</span>.object.matrix.n24 = <span class="keyword">this</span>.object.position.y;
		<span class="keyword">this</span>.object.matrix.n34 = <span class="keyword">this</span>.object.position.z;


	};

	<span class="keyword">this</span>.translateX = <span class="function"><span class="keyword">function</span> <span class="params">( distance )</span> {</span>

		<span class="keyword">this</span>.object.position.x += <span class="keyword">this</span>.object.matrix.n11 * distance;
		<span class="keyword">this</span>.object.position.y += <span class="keyword">this</span>.object.matrix.n21 * distance;
		<span class="keyword">this</span>.object.position.z += <span class="keyword">this</span>.object.matrix.n31 * distance;

	};

	<span class="keyword">this</span>.translateY = <span class="function"><span class="keyword">function</span> <span class="params">( distance )</span> {</span>

		<span class="keyword">this</span>.object.position.x += <span class="keyword">this</span>.object.matrix.n12 * distance;
		<span class="keyword">this</span>.object.position.y += <span class="keyword">this</span>.object.matrix.n22 * distance;
		<span class="keyword">this</span>.object.position.z += <span class="keyword">this</span>.object.matrix.n32 * distance;

	};

	<span class="keyword">this</span>.translateZ = <span class="function"><span class="keyword">function</span> <span class="params">( distance )</span> {</span>

		<span class="keyword">this</span>.object.position.x -= <span class="keyword">this</span>.object.matrix.n13 * distance;
		<span class="keyword">this</span>.object.position.y -= <span class="keyword">this</span>.object.matrix.n23 * distance;
		<span class="keyword">this</span>.object.position.z -= <span class="keyword">this</span>.object.matrix.n33 * distance;

	};


	<span class="keyword">this</span>.rotateHorizontally = <span class="function"><span class="keyword">function</span> <span class="params">( amount )</span> {</span>

		<span class="comment">// please note that the amount is NOT degrees, but a scale value</span>

		xTemp.set( <span class="keyword">this</span>.object.matrix.n11, <span class="keyword">this</span>.object.matrix.n21, <span class="keyword">this</span>.object.matrix.n31 );
		xTemp.multiplyScalar( amount );

		<span class="keyword">this</span>.forward.subSelf( xTemp );
		<span class="keyword">this</span>.forward.normalize();

	};

	<span class="keyword">this</span>.rotateVertically = <span class="function"><span class="keyword">function</span> <span class="params">( amount )</span> {</span>

		<span class="comment">// please note that the amount is NOT degrees, but a scale value</span>

		yTemp.set( <span class="keyword">this</span>.object.matrix.n12, <span class="keyword">this</span>.object.matrix.n22, <span class="keyword">this</span>.object.matrix.n32 );
		yTemp.multiplyScalar( amount );

		<span class="keyword">this</span>.forward.addSelf( yTemp );
		<span class="keyword">this</span>.forward.normalize();

	};

	<span class="function"><span class="keyword">function</span> <span class="title">onKeyDown</span><span class="params">( event )</span> {</span>

		<span class="keyword">switch</span>( event.keyCode ) {

			<span class="keyword">case</span> <span class="number">38</span>: <span class="comment">/*up*/</span>
			<span class="keyword">case</span> <span class="number">87</span>: <span class="comment">/*W*/</span> forwardSpeed = <span class="number">1</span>; <span class="keyword">break</span>;

			<span class="keyword">case</span> <span class="number">37</span>: <span class="comment">/*left*/</span>
			<span class="keyword">case</span> <span class="number">65</span>: <span class="comment">/*A*/</span> sideSpeed = -<span class="number">1</span>; <span class="keyword">break</span>;

			<span class="keyword">case</span> <span class="number">40</span>: <span class="comment">/*down*/</span>
			<span class="keyword">case</span> <span class="number">83</span>: <span class="comment">/*S*/</span> forwardSpeed = -<span class="number">1</span>; <span class="keyword">break</span>;

			<span class="keyword">case</span> <span class="number">39</span>: <span class="comment">/*right*/</span>
			<span class="keyword">case</span> <span class="number">68</span>: <span class="comment">/*D*/</span> sideSpeed = <span class="number">1</span>; <span class="keyword">break</span>;

			<span class="keyword">case</span> <span class="number">81</span>: <span class="comment">/*Q*/</span> doRoll = <span class="literal">true</span>; rollDirection = <span class="number">1</span>; <span class="keyword">break</span>;
			<span class="keyword">case</span> <span class="number">69</span>: <span class="comment">/*E*/</span> doRoll = <span class="literal">true</span>; rollDirection = -<span class="number">1</span>; <span class="keyword">break</span>;

			<span class="keyword">case</span> <span class="number">82</span>: <span class="comment">/*R*/</span> upSpeed = <span class="number">1</span>; <span class="keyword">break</span>;
			<span class="keyword">case</span> <span class="number">70</span>: <span class="comment">/*F*/</span> upSpeed = -<span class="number">1</span>; <span class="keyword">break</span>;

		}

	};

	<span class="function"><span class="keyword">function</span> <span class="title">onKeyUp</span><span class="params">( event )</span> {</span>

		<span class="keyword">switch</span>( event.keyCode ) {

			<span class="keyword">case</span> <span class="number">38</span>: <span class="comment">/*up*/</span>
			<span class="keyword">case</span> <span class="number">87</span>: <span class="comment">/*W*/</span> forwardSpeed = <span class="number">0</span>; <span class="keyword">break</span>;

			<span class="keyword">case</span> <span class="number">37</span>: <span class="comment">/*left*/</span>
			<span class="keyword">case</span> <span class="number">65</span>: <span class="comment">/*A*/</span> sideSpeed = <span class="number">0</span>; <span class="keyword">break</span>;

			<span class="keyword">case</span> <span class="number">40</span>: <span class="comment">/*down*/</span>
			<span class="keyword">case</span> <span class="number">83</span>: <span class="comment">/*S*/</span> forwardSpeed = <span class="number">0</span>; <span class="keyword">break</span>;

			<span class="keyword">case</span> <span class="number">39</span>: <span class="comment">/*right*/</span>
			<span class="keyword">case</span> <span class="number">68</span>: <span class="comment">/*D*/</span> sideSpeed = <span class="number">0</span>; <span class="keyword">break</span>;

			<span class="keyword">case</span> <span class="number">81</span>: <span class="comment">/*Q*/</span> doRoll = <span class="literal">false</span>; <span class="keyword">break</span>;
			<span class="keyword">case</span> <span class="number">69</span>: <span class="comment">/*E*/</span> doRoll = <span class="literal">false</span>; <span class="keyword">break</span>;

			<span class="keyword">case</span> <span class="number">82</span>: <span class="comment">/*R*/</span> upSpeed = <span class="number">0</span>; <span class="keyword">break</span>;
			<span class="keyword">case</span> <span class="number">70</span>: <span class="comment">/*F*/</span> upSpeed = <span class="number">0</span>; <span class="keyword">break</span>;

		}

	};

	<span class="function"><span class="keyword">function</span> <span class="title">onMouseMove</span><span class="params">( event )</span> {</span>

		mouseX = ( event.clientX - windowHalfX ) / window.innerWidth;
		mouseY = ( event.clientY - windowHalfY ) / window.innerHeight;

	};

	<span class="function"><span class="keyword">function</span> <span class="title">onMouseDown</span> <span class="params">( event )</span> {</span>

		event.preventDefault();
		event.stopPropagation();

		<span class="keyword">switch</span> ( event.button ) {

			<span class="keyword">case</span> <span class="number">0</span>: forwardSpeed = <span class="number">1</span>; <span class="keyword">break</span>;
			<span class="keyword">case</span> <span class="number">2</span>: forwardSpeed = -<span class="number">1</span>; <span class="keyword">break</span>;

		}

	};

	<span class="function"><span class="keyword">function</span> <span class="title">onMouseUp</span> <span class="params">( event )</span> {</span>

		event.preventDefault();
		event.stopPropagation();

		<span class="keyword">switch</span> ( event.button ) {

			<span class="keyword">case</span> <span class="number">0</span>: forwardSpeed = <span class="number">0</span>; <span class="keyword">break</span>;
			<span class="keyword">case</span> <span class="number">2</span>: forwardSpeed = <span class="number">0</span>; <span class="keyword">break</span>;

		}

	};

	<span class="keyword">this</span>.domElement.addEventListener( <span class="string">'contextmenu'</span>, <span class="function"><span class="keyword">function</span> <span class="params">( event )</span> {</span> event.preventDefault(); }, <span class="literal">false</span> );

	<span class="keyword">this</span>.domElement.addEventListener( <span class="string">'mousemove'</span>, onMouseMove, <span class="literal">false</span> );
	<span class="keyword">this</span>.domElement.addEventListener( <span class="string">'mousedown'</span>, onMouseDown, <span class="literal">false</span> );
	<span class="keyword">this</span>.domElement.addEventListener( <span class="string">'mouseup'</span>, onMouseUp, <span class="literal">false</span> );
	<span class="keyword">this</span>.domElement.addEventListener( <span class="string">'keydown'</span>, onKeyDown, <span class="literal">false</span> );
	<span class="keyword">this</span>.domElement.addEventListener( <span class="string">'keyup'</span>, onKeyUp, <span class="literal">false</span> );

};
</code></pre>


<div class="keyword-box"><input id="keyword"><button>Search</button></div></body></html>