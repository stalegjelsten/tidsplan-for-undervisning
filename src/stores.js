import { writable } from 'svelte/store';

export const tidsplan_inndata = writable({
	tema: 'Derivasjon',
	laeringsmaal: ['repetere derivasjonsreglene', 'utforske sammensatte funksjoner'],
	startkl: '08:15',
	varighet: 92,
	tidsplan: [
		{
			id: '1',
			varighet: 10,
			innhold: 'Repetisjon av derviasjon fra S1/1T'
		},
		{
			id: '2',
			varighet: 30,
			innhold: 'Oppgave 2.10–2.13 + 2.205'
		},
		{ id: '3', varighet: 20, innhold: 'Pause' },
		{
			id: '4',
			varighet: 10,
			innhold: 'Oppgave 2.10–2.13 + 2.205'
		},
		{
			id: '5',
			varighet: 20,
			innhold: 'Utforsk sammensatte funksjoner s. 65'
		},
		{ id: '6', varighet: 2, innhold: 'Leksearbeid' }
	]
});
