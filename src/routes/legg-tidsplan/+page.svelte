<script>
	import { tidsplan_inndata } from '../../stores';
	const formatLaeringsmaal = (inndata) => {
		let result = '';
		for (let i = 0; i < inndata.length; i++) {
			const element = inndata[i];
			result = result + element + '\n';
		}
		return result.slice(0, -1);
	};
	$: combinedTextarea = [
		'tema: ' + $tidsplan_inndata.tema,
		'læringsmål:',
		$tidsplan_inndata.laeringsmaal.join('\n'),
		'tidsplan:',
		placeHolderTidsplan
	].join('\n');

	const formatTidsplan = (inndata) => {
		let result = '';
		for (let i = 0; i < inndata.length; i++) {
			const element = inndata[i];
			let starttid = new Date();
			starttid.setHours(Number(element.startkl.slice(0, 2)));
			starttid.setMinutes(Number(element.startkl.slice(3, 5)));
			let sluttid = new Date();
			sluttid.setHours(Number(element.sluttkl.slice(0, 2)));
			sluttid.setMinutes(Number(element.sluttkl.slice(3, 5)));
			const diff = sluttid - starttid;
			result = result + String(Math.round(diff / 60 / 1000)) + ' ' + element.innhold + '\n';
		}
		return result.slice(0, -1);
	};
	let placeHolderLaeringsmaal = formatLaeringsmaal($tidsplan_inndata.laeringsmaal);
	let placeHolderTidsplan = formatTidsplan($tidsplan_inndata.tidsplan);
	let placeHolderTema = $tidsplan_inndata.tema;
	let placeHolderStart = $tidsplan_inndata.tidsplan[0].startkl;
	let placeHolderSlutt = $tidsplan_inndata.tidsplan[-1].sluttkl;

	const saveTidsplan = () => {
		let laeringsmaal = placeHolderLaeringsmaal.split('\n');
		const tidsplanRawArray = placeHolderTidsplan.split('\n');
		let nyTidsplan = [];
		const startTime = new Date();
		startTime.setHours(Number(placeHolderStart.slice(0, 2)));
		startTime.setMinutes(Number(placeHolderStart.slice(3, 5)));
		let sluttDato = new Date();
		sluttDato.setHours(Number(placeHolderSlutt.slice(0, 2)));
		sluttDato.setMinutes(Number(placeHolderSlutt.slice(3, 5)));
		const lessonDuration = Math.round((sluttDato - startTime) / 60 / 1000);
		sluttDato = startTime;
		for (let i = 0; i < tidsplanRawArray.length; i++) {
			const element = tidsplanRawArray[i];
			const id = i + 1;
			let minStartkl = placeHolderStart;
			if (i > 0) {
				minStartkl = nyTidsplan[i - 1].sluttkl;
			}
			let minSluttkl = placeHolderSlutt;
			const tempStarttid = sluttDato;
			if (i == 0) {
				sluttDato = new Date(
					startTime.getTime() + Number(tidsplanRawArray[0].split(' ')[0]) * 60 * 1000
				);
				minSluttkl =
					('0' + String(sluttDato.getHours())).slice(-2) +
					':' +
					('0' + String(sluttDato.getMinutes())).slice(-2);
			} else if (i < tidsplanRawArray.length - 1 && i > 0) {
				sluttDato = new Date(
					sluttDato.getTime() + Number(tidsplanRawArray[i].split(' ')[0]) * 60 * 1000
				);
				minSluttkl =
					('0' + String(sluttDato.getHours())).slice(-2) +
					':' +
					('0' + String(sluttDato.getMinutes())).slice(-2);
			} else {
				sluttDato = new Date();
				sluttDato.setHours(Number(placeHolderSlutt.slice(0, 2)));
				sluttDato.setMinutes(Number(placeHolderSlutt.slice(3, 5)));
			}
			const [first, ...innholdArray] = element.split(' ');
			const bolkDuration = Math.round((sluttDato - tempStarttid) / 60 / 1000);

			nyTidsplan.push({
				id: String(id),
				startkl: minStartkl,
				sluttkl: minSluttkl,
				andel: Math.round((bolkDuration / lessonDuration) * 100),
				innhold: innholdArray.join(' ')
			});
		}
		tidsplan_inndata.set({
			tema: placeHolderTema,
			laeringsmaal: laeringsmaal,
			tidsplan: nyTidsplan
		});
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
	<label for="tema"> Tema:</label>
	<input type="text" name="tema" placeholder="Tema" bind:value={placeHolderTema} />
	<br />
	<label for="laeringsmaal"> Læringsmål:</label>
	<textarea
		name="laeringsmaal"
		cols="50"
		rows="5"
		placeholder="Det første læringsmålet"
		bind:value={placeHolderLaeringsmaal}
	/>
	<br />

	<label for="starttid">Starttid for undervisningsøkta:</label>
	<input type="time" name="starttid" bind:value={placeHolderStart} />
	<br />

	<label for="sluttid">Sluttid for undervisningsøkta:</label>
	<input type="time" name="sluttid" bind:value={placeHolderSlutt} />
	<br />

	<label for="tidsplan">Tidsplan:</label>
	<textarea
		name="tidsplan"
		id="tidsplan"
		cols="50"
		rows="10"
		placeholder="15 Intro"
		bind:value={placeHolderTidsplan}
	/>
	<button type="button" on:click={saveTidsplan}>Legg inn!</button>
	<a href="vis-tidsplan">Vis tidsplan</a>

	<label for="rawData">Rådata</label>
	<textarea name="rawData" id="rawData" cols="30" rows="30" bind:value={combinedTextarea} />
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
	div#container {
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
	}
	label {
		margin-top: 1rem 0;
	}
</style>
