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
			result = result + String(diff / 60 / 1000) + ' ' + element.innhold + '\n';
		}
		return result.slice(0, -1);
	};
	const placeHolderLaeringsmaal = formatLaeringsmaal($tidsplan_inndata.laeringsmaal);
	const placeHolderTidsplan = formatTidsplan($tidsplan_inndata.tidsplan);

	const saveTidsplan = (formData) => {
		tidsplan_inndata.update({
			tema: 'none',
			laeringsmaal: ['hei'],
			tidsplan: { id: '1', startkl: '00.00', sluttkl: '01.00', andel: 17, innhold: 'pasta' }
		});
		console.log($tidsplan_inndata);
	};
</script>

<div id="container">
	<label for="tema">
		Tema:
		<input type="text" name="tema" placeholder="Tema" />
	</label><br />
	<label for="laeringsmaal">
		Læringsmål:
		<textarea
			name="laeringsmaal"
			cols="50"
			rows="5"
			placeholder="Det første læringsmålet"
			value={placeHolderLaeringsmaal}
		/>
	</label><br />

	<label for="starttid">
		Starttid for undervisningsøkta:
		<input type="time" name="starttid" />
	</label><br />

	<label for="sluttid">
		Sluttid for undervisningsøkta:
		<input type="time" name="sluttid" />
	</label><br />

	<label for="tidsplan">
		Tidsplan:
		<textarea
			name="tidsplan"
			id="tidsplan"
			cols="50"
			rows="10"
			placeholder="15 Intro"
			value={placeHolderTidsplan}
		/>
	</label>
	<button type="button" on:click={saveTidsplan}>Legg inn!</button>
</div>

<style>
	div#container {
		display: flex;
		flex-direction: column;
	}
</style>
