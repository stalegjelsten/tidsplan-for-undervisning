<script>
	import { tidsplan_inndata } from '../../stores';
	const formaterLaeringsmaal = (inndata) => {
		let result = '';
		for (let i = 0; i < inndata.length; i++) {
			const element = inndata[i];
			result = result + element + '\n';
		}
		return result.slice(0, -1);
	};

	let totalVarighet = 0;

	const formaterTidsplan = (inndata) => {
		let result = '';
		for (let i = 0; i < inndata.length; i++) {
			const element = inndata[i];
			result = result + element.varighet + ' ' + element.innhold + '\n';
		}
		return result.slice(0, -1);
	};

	let placeHolderLaeringsmaal = formaterLaeringsmaal($tidsplan_inndata.laeringsmaal);
	let placeHolderTidsplan = formaterTidsplan($tidsplan_inndata.tidsplan);
	let placeHolderTema = $tidsplan_inndata.tema;
	let placeHolderStart = $tidsplan_inndata.startkl;
	let placeHolderTidsLinjal = $tidsplan_inndata.visTidsLinjal;

	const lagKombinertTekstfelt = () => {
		return [
			'tema: ' + $tidsplan_inndata.tema,
			'startkl: ' + $tidsplan_inndata.startkl,
			'læringsmål:',
			$tidsplan_inndata.laeringsmaal.join('\n'),
			'tidsplan:',
			placeHolderTidsplan
		].join('\n');
	};

	const lagreTidsplan = () => {
		let laeringsmaal = placeHolderLaeringsmaal.split('\n');
		const tidsplanRawArray = placeHolderTidsplan.split('\n');
		let nyTidsplan = [];
		let kumulativVarighet = 0;
		for (let i = 0; i < tidsplanRawArray.length; i++) {
			const element = tidsplanRawArray[i];
			const id = i + 1;
			const [varighet, ...innholdArray] = element.split(' ');
			nyTidsplan.push({
				id: String(id),
				varighet: Number(varighet),
				innhold: innholdArray.join(' ')
			});
			kumulativVarighet += Number(varighet);
		}
		tidsplan_inndata.set({
			tema: placeHolderTema,
			startkl: placeHolderStart,
			laeringsmaal: laeringsmaal,
			varighet: kumulativVarighet,
			tidsplan: nyTidsplan,
			visTidsLinjal: placeHolderTidsLinjal
		});
		totalVarighet = kumulativVarighet;
		combinedTextarea = lagKombinertTekstfelt();
	};

	const lagreRaadata = () => {
		const raadataArray = combinedTextarea.split('\n');
		const laeringsmaalIndex = raadataArray.indexOf('læringsmål:');
		const tidsplanIndex = raadataArray.indexOf('tidsplan:');
		const raadataTidsplanArray = raadataArray.slice(tidsplanIndex + 1, raadataArray.length);
		let nyTidsplan = [];
		let kumulativVarighet = 0;
		for (let i = 0; i < raadataTidsplanArray.length; i++) {
			const element = raadataTidsplanArray[i];
			const id = i + 1;
			const [varighet, ...innholdArray] = element.split(' ');
			nyTidsplan.push({
				id: String(id),
				varighet: Number(varighet),
				innhold: innholdArray.join(' ')
			});
			kumulativVarighet += Number(varighet);
		}
		tidsplan_inndata.set({
			tema: raadataArray[0].slice(6),
			startkl: raadataArray[1].slice(9),
			laeringsmaal: raadataArray.slice(laeringsmaalIndex + 1, tidsplanIndex),
			varighet: kumulativVarighet,
			tidsplan: nyTidsplan
		});
		totalVarighet = kumulativVarighet;
		placeHolderLaeringsmaal = formaterLaeringsmaal($tidsplan_inndata.laeringsmaal);
		placeHolderTema = $tidsplan_inndata.tema;
		placeHolderStart = $tidsplan_inndata.startkl;
		placeHolderTidsplan = formaterTidsplan($tidsplan_inndata.tidsplan);
	};

	let combinedTextarea = lagKombinertTekstfelt();
</script>

<div id="container">
	<label for="tema"> Tema:</label>
	<input type="text" name="tema" placeholder="Tema" bind:value={placeHolderTema} />
	<br />
	<label for="laeringsmaal"> Læringsmål:</label>
	<textarea
		name="laeringsmaal"
		cols="50"
		rows="3"
		placeholder="Det første læringsmålet"
		bind:value={placeHolderLaeringsmaal}
	></textarea>
	<br />

	<label for="starttid">Starttid for undervisningsøkta:</label>
	<input type="time" name="starttid" bind:value={placeHolderStart} />
	<br />

	<label for="tidsplan">Tidsplan:</label>
	<textarea
		name="tidsplan"
		id="tidsplan"
		cols="50"
		rows="8"
		placeholder="15 Intro"
		bind:value={placeHolderTidsplan}
	></textarea>
	<button type="button" on:click={lagreTidsplan} name="submit tidsplan">Legg inn tidsplan!</button>
	<p>Total varighet: {totalVarighet} minutter.</p>
	<a href="vis-tidsplan"><button>Vis tidsplan</button></a>

	<label for="rawData">Rådata</label>
	<textarea name="rawData" id="rawData" cols="30" rows="15" bind:value={combinedTextarea} />
	<button type="submit" name="submit rådata" on:click={lagreRaadata}
		>Legg inn tidsplan fra rådata!</button
	>
</div>
<div id="scrollbar" />

<style>
	h1 {
		padding: 0.5rem;
		font-size: 150%;
	}
	div#container {
		max-width: 50rem;
		padding: 1rem;
		display: flex;
		flex-direction: column;
	}
	input,
	textarea,
	button {
		width: 100%;
		margin: 0 0 0.5rem 0;
		display: inline-block;
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
		transition: all 0.1s eas;
	}
	button:hover {
		transform: scale(1.02);
	}
	button:active {
		transform: translateX(0.2rem) translateY(0.2rem);
	}
	label {
		margin-top: 1rem 0;
	}
	div#scrollbar {
		visibility: hidden;
		position: absolute;
		z-index: 1;
		bottom: -10rem;
		overflow: hidden;
	}
</style>
