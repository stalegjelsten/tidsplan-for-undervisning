<script>
	import { browser } from '$app/environment';

	let tidsplan_inndata = {
		tema: 'Derivasjon',
		laeringsmaal: ['repetere derivasjonsreglene', 'utforske sammensatte funksjoner'],
		tidsplan: [
			{
				id: '1',
				startkl: '09.55',
				sluttkl: '10.15',
				andel: 17,
				innhold: 'Repetisjon av derviasjon fra S1/1T'
			},
			{
				id: '2',
				startkl: '10.20',
				sluttkl: '10.40',
				andel: 22,
				innhold: 'Oppgave 2.10–2.13 + 2.205'
			},
			{ id: '3', startkl: '10.40', sluttkl: '10.47', andel: 11, innhold: 'Pause' },
			{
				id: '4',
				startkl: '10.47',
				sluttkl: '11.00',
				andel: 22,
				innhold: 'Oppgave 2.10–2.13 + 2.205'
			},
			{
				id: '5',
				startkl: '11.00',
				sluttkl: '11.20',
				andel: 17,
				innhold: 'Utforsk sammensatte funksjoner s. 65'
			},
			{ id: '6', startkl: '11.20', sluttkl: '11.27', andel: 17, innhold: 'Leksearbeid' }
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
