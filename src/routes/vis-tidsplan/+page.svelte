<script>
	import { browser } from '$app/environment';
	import { tidsplan_inndata } from '../../stores';
	import { writable } from 'svelte/store';
	let coords = writable({ x: 50, y: 50 });

	const colors = [
		'e0c3fc',
		'ddbdfc',
		'dab6fc',
		'cbb2fe',
		'bbadff',
		'ada7ff',
		'9fa0ff',
		'8e94f2',
		'8187dc',
		'757bc8'
	];
	const beregnKumulativ = () => {
		let result = [0];
		for (let i = 0; i < $tidsplan_inndata.tidsplan.length; i++) {
			const element = $tidsplan_inndata.tidsplan[i].varighet;
			result.push(result[i] + element);
		}
		return result;
	};
	let kumulativVarighet = beregnKumulativ();

	let myStart = new Date();
	myStart.setHours(Number($tidsplan_inndata.startkl.slice(0, 2)));
	myStart.setMinutes(Number($tidsplan_inndata.startkl.slice(3, 5)));
	myStart.setSeconds(0);

	$: end = new Date(
		myStart.getTime() + kumulativVarighet[kumulativVarighet.length - 1] * 60 * 1000
	);

	setInterval(() => {
		if (browser) {
			let height = document.getElementById('tidsplan').offsetHeight;

			document.getElementById('scrollbar').style.marginTop =
				getPositionOfScrollbar(height, myStart, end) - 5 + 'px';
			//TODO: if scrollbar is on top of another div: make that div stand out.
			// offsetTop is probably the wrong property.
			for (let i = 0; i < $tidsplan_inndata.tidsplan.length - 1; i++) {
				const element = document.getElementById(String(i + 1));
				const boxY = element.offsetTop;
				const nextBoxY = document.getElementById(String(i + 2)).offsetTop;
				const scrollbarY = document.getElementById('scrollbar').offsetTop;
				if (
					(scrollbarY + 5 > boxY && scrollbarY < nextBoxY) ||
					(i == $tidsplan_inndata.tidsplan.length - 1 && scrollbarY + 5 > boxY)
				) {
					document.getElementById(i + 1).style.fontWeight = '700';
					document.getElementById(i + 1).style.filter = 'brightness(1.1)';
					document.getElementById(i + 1).style.width = 'calc(100vw - 1.8rem)';
				} else {
					document.getElementById(i + 1).style.fontWeight = '400';
					document.getElementById(i + 1).style.filter = 'brightness(1)';
					document.getElementById(i + 1).style.width = 'calc(100vw - 2rem)';
				}
			}
		}
	}, 1000);

	function getPositionOfScrollbar(tidsplanHeight, startTime, endTime) {
		let now = new Date();
		if (now < endTime && now > startTime && browser) {
			// shows the scrollbar if the lesson is in progress
			const amountDone = (now - startTime) / (endTime - startTime);
			document.getElementById('scrollbar').style.visibility = 'visible';

			// finn ut hvor mange bolker som er ferdige og legg til ekstra offset pga borders
			let borderOffset = -2;
			const minutesSinceStart = Math.round((now.getTime() - startTime.getTime()) / 60 / 1000);
			for (let index = 0; index < kumulativVarighet.length; index++) {
				const element = kumulativVarighet[index];
				if (element < minutesSinceStart) {
					borderOffset += 4;
				}
			}

			return Math.round(amountDone * tidsplanHeight) + borderOffset;
		} else if (now > endTime && browser) {
			document.getElementById('scrollbar').style.visibility = 'hidden';
		}
	}
	const resizeBoxes = (boxId) => {
		const windowWidth = window.innerWidth;
		console.log('Pressed mouse on ' + boxId + ' at coords' + $coords.x + 'x' + $coords.y);
		// if (boxId < $tidsplan_inndata.tidsplan.length) {
		// 	if (
		// 		Math.abs($coords.y - document.getElementById(Number(boxId) + 1).offsetTop) < 12 ||
		// 		Math.abs($coords.y - document.getElementById(boxId).offsetTop) < 12
		// 	) {
		// 		console.log('På linja mellom to bokser');
		// 		if (browser) {
		// 			let tidsplanHeight = document.getElementById('tidsplan').offsetHeight;
		// 		}
		// 		let currentBoxHeight = document.getElementById(boxId).offsetHeight;
		// 		let nextBoxHeight = document.getElementById(Number(boxId) + 1).offsetHeight;
		// 		document.getElementById(boxId).style.flex = 4;
		// 	}
		let nyTidsplan = $tidsplan_inndata.tidsplan;
		if ($coords.x > windowWidth / 2) {
			nyTidsplan[boxId - 1].varighet += 1;
		} else {
			nyTidsplan[boxId - 1].varighet -= 1;
		}
		kumulativVarighet = beregnKumulativ();
		tidsplan_inndata.set({
			tema: $tidsplan_inndata.tema,
			startkl: $tidsplan_inndata.startkl,
			laeringsmaal: $tidsplan_inndata.laeringsmaal,
			varighet: kumulativVarighet[kumulativVarighet.length - 1],
			tidsplan: nyTidsplan
		});
	};
</script>

<div id="container">
	<div id="laeringsmaal">
		<h1><a href="legg-tidsplan">{$tidsplan_inndata.tema}</a></h1>
		<ul>
			{#each $tidsplan_inndata.laeringsmaal as maal}
				<li>{maal}</li>
			{/each}
		</ul>
	</div>

	<h1>
		Tidsplan {(
			'0' + new Date(myStart.getTime() + kumulativVarighet[0] * 60 * 1000).getHours()
		).slice(-2)}:{(
			'0' + new Date(myStart.getTime() + kumulativVarighet[0] * 60 * 1000).getMinutes()
		).slice(-2)}–{(
			'0' +
			new Date(
				myStart.getTime() + kumulativVarighet[kumulativVarighet.length - 1] * 60 * 1000
			).getHours()
		).slice(-2)}:{(
			'0' +
			new Date(
				myStart.getTime() + kumulativVarighet[kumulativVarighet.length - 1] * 60 * 1000
			).getMinutes()
		).slice(-2)}
	</h1>
	<div id="tidsplan">
		<div id="scrollbar">&nbsp;</div>
		{#each $tidsplan_inndata.tidsplan as undervisningsbolk, i}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				id={undervisningsbolk.id}
				class="bolk"
				style="flex: {Math.round(
					(undervisningsbolk.varighet / $tidsplan_inndata.varighet) * 1000
				)}; background-color: #{colors[i % colors.length]};"
				on:mousemove={(e) => {
					coords.set({ x: e.clientX, y: e.clientY });
				}}
				on:mousedown={resizeBoxes(undervisningsbolk.id)}
			>
				{('0' + new Date(myStart.getTime() + kumulativVarighet[i] * 60 * 1000).getHours()).slice(
					-2
				)}:{(
					'0' + new Date(myStart.getTime() + kumulativVarighet[i] * 60 * 1000).getMinutes()
				).slice(-2)}
				{undervisningsbolk.innhold}
			</div>
		{/each}
	</div>
</div>

<style>
	@font-face {
		font-family: 'Josefin Sans';
		src: local('fonts/JosefinSans-VariableFont_wght.ttf'),
			local('fonts/JosefinSans-Italic-VariableFont_wght.ttf');
	}
	:global(html) {
		height: 100%;
		margin: 0;
		font-size: 62.5%;
	}
	:global(body) {
		height: 100%;
		margin: 0;
		font-family: 'Josefin Sans', Arial, Helvetica, sans-serif;
		font-size: 200%;
	}
	h1 {
		/* padding: 1rem 1rem 0 1rem; */
		font-size: 120%;
		margin: 1rem 0.5rem 0 0.5rem;
	}
	#laeringsmaal ul {
		margin: 0;
		padding: 0 4rem;
	}
	div#container {
		display: flex;
		flex-direction: column;
		height: 100%;
		background-color: #ffd6ff;
	}
	#container #laeringsmaal {
		flex: 0 1 auto;
	}
	#container #tidsplan {
		overflow: hidden;
		z-index: 0;
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		/* gap: 0.35rem; */
	}
	.bolk {
		width: calc(100vw - 2rem);
		z-index: 0;
		font-size: clamp(1.8rem, 3.5vh, 2.5rem);
		border: 2px solid black;
		/* min-height: 2rem; */
		padding: 0.5vh;
		user-select: none;
		border-radius: 1rem;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		overflow: hidden;
		transition: all 0.3s ease-in-out;
	}

	.bolk:hover {
		color: rgb(80, 40, 40);
		filter: brightness(1.05) saturate(1.3);
	}

	div#scrollbar {
		z-index: 1;
		overflow: hidden;
		position: absolute;
		width: 100%;
		height: 1rem;
		font-weight: 400;
		background-color: rgba(255, 0, 0, 0.5);
		visibility: hidden;
	}
	a {
		color: black;
		text-decoration: none;
		transition: all 0.1s ease-in-out;
	}

	a:hover {
		color: darkred;
		text-decoration: underline;
	}
</style>
