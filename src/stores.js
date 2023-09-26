import { writable } from 'svelte/store';

export const tidsplan_inndata = writable({
	tema: 'Derivasjon',
	laeringsmaal: ['repetere derivasjonsreglene', 'utforske sammensatte funksjoner'],
	tidsplan: [
		{
			id: '1',
			startkl: '09:55',
			sluttkl: '10:15',
			varighet: 20,
			andel: 17,
			innhold: 'Repetisjon av derviasjon fra S1/1T'
		},
		{
			id: '2',
			startkl: '10:20',
			sluttkl: '10:40',
			varighet: 20,
			andel: 22,
			innhold: 'Oppgave 2.10–2.13 + 2.205'
		},
		{ id: '3', startkl: '10:40', sluttkl: '10:47', andel: 11, innhold: 'Pause' },
		{
			id: '4',
			startkl: '10:47',
			sluttkl: '11:00',
			varighet: 20,
			andel: 22,
			innhold: 'Oppgave 2.10–2.13 + 2.205'
		},
		{
			id: '5',
			startkl: '11:00',
			sluttkl: '11:20',
			varighet: 20,
			andel: 17,
			innhold: 'Utforsk sammensatte funksjoner s. 65'
		},
		{ id: '6', startkl: '11:20', sluttkl: '11:27', varighet: 20, andel: 17, innhold: 'Leksearbeid' }
	]
});
