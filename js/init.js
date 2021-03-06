let inits = [];

try {
	inits = JSON.parse(sessionStorage.getItem('inits')) || [];
	if (inits.length > 0) {
		updateInitTable();
	}
} catch {
	console.log('Couldn\'t load init storage');
	inits = [];
}

roll();

$('#init-add').on('click', () => {
	try {
		const name = $('#init-name')[0].value;
		const score = Number.parseInt($('#init-init')[0].value, 10);
		const mod = Number.parseInt($('#init-mod')[0].value, 10);
		inits.push({name, score, mod, active: false});
		updateInitTable();
		roll();
		const counterTest = /\d+$/;
		if (counterTest.test(name)) {
			const number = Number.parseInt(name.match(counterTest), 10);
			const nextName = name.replace(counterTest, number + 1);
			$('#init-name').val(nextName);
		}
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

$('#remove-entry').on('click', () => {
	try {
		const index = Number.parseInt($('#entry-to-remove')[0].value, 10);
		console.log(index);
		inits.splice(index, 1);
		updateInitTable();
	} catch (error) {
		console.error(error);
		$('body').toast({
			title: 'Error removing the entry!',
			message: 'Check the logs for details.',
			class: 'error'
		});
	}
});

function roll() {
	$('#init-init').val(Math.round(1 + (Math.random() * 19)));
}

function updateInitTable() {
	sessionStorage.setItem('inits', JSON.stringify(inits));

	inits = inits.sort((a, b) => {
		if (a.score + a.mod === b.score + b.mod) {
			return a.mod < b.mod;
		}

		return a.score + a.mod < b.score + b.mod;
	});
	$('#init-table').empty();
	for (const i of inits) {
		$('#init-table').append(`<div class="row">
			${i.active ? `<div class="ui one wide column">
				<i class="ui walking icon"></i>
			</div>` : ''}
			<div class="ui ${i.active ? 'seven' : 'eight'} wide column">
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
			$('#init-table').children().last()[0].scrollIntoView({
				behavior: 'smooth',
				block: 'nearest'
			});
		}
	}

	for (const [i, init] of inits.entries()) {
		if (init.active) {
			$('#entry-to-remove')[0].value = i;
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
