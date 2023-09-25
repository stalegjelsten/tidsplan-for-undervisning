<script>
	import { browser } from '$app/environment';

	let tidsplan_inndata = {
		tema: 'Derivasjon',
		laeringsmaal: [
			'bruke universell utforming',
			'et langt og kjedelig læringsmål',
			'veeeellldig langt og kjedelig læringsmål som går over flere linjer'
		],
		tidsplan: [
			{ id: '1', startkl: '21.00', sluttkl: '12.15', andel: 17, innhold: 'Intro' },
			{ id: '2', startkl: '12.10', sluttkl: '12.25', andel: 22, innhold: 'Oppgave' },
			{ id: '3', startkl: '12.25', sluttkl: '12.35', andel: 11, innhold: 'egenarbeid' },
			{ id: '4', startkl: '12.35', sluttkl: '12.55', andel: 22, innhold: 'Pause' },
			{ id: '5', startkl: '13.00', sluttkl: '13.15', andel: 17, innhold: 'Nydelige saker' },
			{ id: '6', startkl: '13.15', sluttkl: '23.32', andel: 17, innhold: 'oppsummering' }
		]
	};
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

	let myStart = new Date();
	myStart.setHours(Number(tidsplan_inndata.tidsplan[0].startkl.slice(0, 2)));
	myStart.setMinutes(Number(tidsplan_inndata.tidsplan[0].startkl.slice(3, 5)));
	myStart.setSeconds(0);

	let end = new Date();
	end.setHours(
		Number(tidsplan_inndata.tidsplan[tidsplan_inndata.tidsplan.length - 1].sluttkl.slice(0, 2))
	);
	end.setMinutes(
		Number(tidsplan_inndata.tidsplan[tidsplan_inndata.tidsplan.length - 1].sluttkl.slice(3, 5))
	);
	end.setSeconds(0);

	setInterval(() => {
		if (browser) {
			let height = document.querySelector('#tidsplan').offsetHeight;

			document.getElementById('scrollbar').style.marginTop =
				getPositionOfScrollbar(height, myStart, end) + 'px';
		}
	}, 1000);

	function getPositionOfScrollbar(tidsplanHeight, startTime, endTime) {
		let now = new Date();
		const amountDone = (now - startTime) / (endTime - startTime);
		return Math.round(amountDone * tidsplanHeight);
	}
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
		<h1>{tidsplan_inndata.tema}</h1>
		<ul>
			{#each tidsplan_inndata.laeringsmaal as maal}
				<li>{maal}</li>
			{/each}
		</ul>
	</div>

	<h1>Tidsplan</h1>
	<div id="tidsplan">
		<div id="scrollbar">&nbsp;</div>
		{#each tidsplan_inndata.tidsplan as undervisningsbolk, i}
			<div
				id={undervisningsbolk.id}
				class="bolk"
				style="flex: {undervisningsbolk.andel}; background-color: #{colors[i % colors.length]};"
			>
				{undervisningsbolk.startkl}
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
		font-size: 250%;
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
		/* outline: 2px solid red; */
		padding: 0.5rem;
	}
	div#scrollbar {
		z-index: 1;
		position: absolute;
		width: 100%;
		height: 1rem;
		background-color: rgba(255, 0, 0, 0.5);
	}
</style>
