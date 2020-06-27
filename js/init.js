let inits = [];

roll();

$('#init-add').on('click', () => {
	try {
		const name = $('#init-name')[0].value;
		const score = Number.parseInt($('#init-init')[0].value, 10);
		const mod = Number.parseInt($('#init-mod')[0].value, 10);
		inits.push({name, score, mod, active: false});
		updateInitTable();
		roll();
	} catch (error) {
		console.error(error);
		$('body').toast({
			title: 'Error adding the new player!',
			message: 'Check the logs for details.',
			class: 'error'
		});
	}
});

$('#init-next').on('click', () => {
	try {
		nextPlayer(1);
		updateInitTable();
	} catch (error) {
		console.error(error);
		$('body').toast({
			title: 'Error moving to the next player!',
			message: 'Check the logs for details.',
			class: 'error'
		});
	}
});

$('#init-back').on('click', () => {
	try {
		nextPlayer(-1);
		updateInitTable();
	} catch (error) {
		console.error(error);
		$('body').toast({
			title: 'Error moving to the next player!',
			message: 'Check the logs for details.',
			class: 'error'
		});
	}
});

$('#init-rand').on('click', roll);

function roll() {
	$('#init-init').val(Math.round(Math.random() * 20));
}

function updateInitTable() {
	inits = inits.sort((a, b) => {
		if (a.score === b.score) {
			return a.mod < b.mod;
		}

		return a.score < b.score;
	});
	$('#init-table').empty();
	for (const i of inits) {
		$('#init-table').append(`<div class="row">
			<div class="ui one wide column">
				<i class="ui ${i.active ? 'walking' : 'bed'} icon"></i>
			</div>
			<div class="ui seven wide column">
			${i.active ? '<b>' : ''}
				${i.name}
			${i.active ? '</b>' : ''}
			</div>
			<div class="ui seven wide column">
			${i.active ? '<b>' : ''}
				${i.score + i.mod}
			${i.active ? '</b>' : ''}
			</div>
			<div class="ui one wide column">
			${i.active ? '<b>' : ''}
				${i.mod <= 0 ? i.mod : '+' + i.mod}
			${i.active ? '</b>' : ''}
			</div>
		</div>`);
		if (i.active) {
			$('#init-table').children().last()[0].scrollIntoView({behavior: 'smooth'});
		}
	}
}

function nextPlayer(offset) {
	if (inits.length === 0) {
		return;
	}

	for (let i in inits) {
		if (inits[i].name) {
			i = Number.parseInt(i, 10);
			if (inits[i].active) {
				inits[i].active = false;
				inits[betterMod((i + offset), inits.length)].active = true;
				return;
			}
		}
	}

	inits[0].active = true;
}

function betterMod(a, n) {
	return ((a % n) + n) % n;
}
