<script>
	import { browser } from '$app/environment';
	import { tidsplan_inndata } from '../../stores';
	import { spring } from 'svelte/motion';
	let coords = spring({ x: 50, y: 50 });

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

	let end = new Date(
		myStart.getTime() + kumulativVarighet[kumulativVarighet.length - 1] * 60 * 1000
	);

	setInterval(() => {
		if (browser) {
			let height = document.getElementById('tidsplan').offsetHeight;

			document.getElementById('scrollbar').style.marginTop =
				getPositionOfScrollbar(height, myStart, end) + 'px';
		}
	}, 1000);

	function getPositionOfScrollbar(tidsplanHeight, startTime, endTime) {
		let now = new Date();
		if (now < endTime && now > startTime && browser) {
			// shows the scrollbar if the lesson is in progress
			const amountDone = (now - startTime) / (endTime - startTime);
			document.getElementById('scrollbar').style.visibility = 'visible';
			return Math.round(amountDone * tidsplanHeight);
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
		tidsplan_inndata.set({
			tema: $tidsplan_inndata.tema,
			startkl: $tidsplan_inndata.startkl,
			laeringsmaal: $tidsplan_inndata.laeringsmaal,
			varighet: $tidsplan_inndata.varighet,
			tidsplan: nyTidsplan
		});
		kumulativVarighet = beregnKumulativ();
	};
</script>

<head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;700&display=swap"
		rel="stylesheet"
	/></head
>

<div id="container">
	<div id="laeringsmaal">
		<h1>{$tidsplan_inndata.tema}</h1>
		<ul>
			{#each $tidsplan_inndata.laeringsmaal as maal}
				<li>{maal}</li>
			{/each}
		</ul>
	</div>

	<h1>Tidsplan</h1>
	<div id="tidsplan">
		<div id="scrollbar">&nbsp;</div>
		{#each $tidsplan_inndata.tidsplan as undervisningsbolk, i}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				id={undervisningsbolk.id}
				class="bolk"
				style="flex: {Math.round(
					(undervisningsbolk.varighet / $tidsplan_inndata.varighet) * 100
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
		padding: 0.5rem;
		font-size: 150%;
	}
	#laeringsmaal ul {
		margin: 0;
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
		z-index: 0;
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
	}
	.bolk {
		z-index: 0;
		min-height: 2rem;
		padding: 0.5rem;
		user-select: none;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	div#scrollbar {
		z-index: 1;
		position: absolute;
		width: 100%;
		height: 1rem;
		background-color: rgba(255, 0, 0, 0.5);
		visibility: hidden;
	}
</style>
