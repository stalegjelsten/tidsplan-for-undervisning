<script>
	let tidsplan_inndata = {
		laeringsmaal: [
			'bruke universell utforming',
			'et langt og kjedelig læringsmål',
			'veeeellldig langt og kjedelig læringsmål som går over flere linjer'
		],
		tidsplan: [
			{ id: '1', startkl: '12.00', sluttkl: '12.15', andel: 17, innhold: 'Intro' },
			{ id: '2', startkl: '12.10', sluttkl: '12.25', andel: 22, innhold: 'Oppgave' },
			{ id: '3', startkl: '12.25', sluttkl: '12.35', andel: 11, innhold: 'egenarbeid' },
			{ id: '4', startkl: '12.35', sluttkl: '12.55', andel: 22, innhold: 'Pause' },
			{ id: '5', startkl: '13.00', sluttkl: '13.15', andel: 17, innhold: 'Nydelige saker' },
			{ id: '6', startkl: '13.15', sluttkl: '13.32', andel: 17, innhold: 'oppsummering' }
		]
	};
</script>

<div id="container">
	<div id="laeringsmaal">
		<h1>Læringsmål</h1>
		<ul>
			{#each tidsplan_inndata.laeringsmaal as maal}
				<li>{maal}</li>
			{/each}
		</ul>
	</div>

	<h1>Tidsplan</h1>
	<div id="tidsplan">
		{#each tidsplan_inndata.tidsplan as undervisningsbolk}
			<div
				id={undervisningsbolk.id}
				name={undervisningsbolk.innhold}
				style="flex: {undervisningsbolk.andel};"
			>
				{undervisningsbolk.innhold}
			</div>
		{/each}
	</div>
</div>

<style>
	:global(html) {
		height: 100%;
		width: 100vw;
		margin: 0;
		font-size: 62.5%;
	}
	h1 {
		font-size: 150%;
	}
	div#container {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	#container #laeringsmaal {
		flex: 0 1 auto;
	}
	#container #tidsplan {
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
	}
	#tidsplan div {
		min-height: 2rem;
		outline: 2px solid red;
	}
</style>
