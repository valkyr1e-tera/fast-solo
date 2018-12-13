const Vec3 = require('tera-vec3');

module.exports = function FastSolo(mod) {
	const chestIds = [81341, 81342],
	chestLoc = new Vec3(52562, 117921, 4431),
	data = {
		7005: { // Velika
			spawn: new Vec3(-481, 6301, 1956),
			redirect: new Vec3(-341, 8665, 2180),
			w: -0.96
		},
		9031: { // Akasha
			spawn: new Vec3(68482, 125779, 776),
			redirect: new Vec3(72416, 133868, -503)
		},
		9032: { // Baracos
			spawn: new Vec3(16921, 177244, -1664),
			redirect: new Vec3(28194, 179672, -1675)
		},
		9713: { // Ghillieglade
			spawn: new Vec3(54997, 116171, 4517),
			redirect: new Vec3(52230, 117225, 4352),
			w: 1.6
		},
		9777: { // Channelworks
			spawn: new Vec3(-121630, -41458, 2398),
			redirect: new Vec3(-112672, -35058, 410)
		}
	};

	let enabled = true,
	reset = false;

	mod.game.me.on('change_zone', (zone) => {
		if (!enabled) return;
		if (zone == 9714 && reset) {
			mod.send('C_RESET_ALL_DUNGEON', 1, {});
			reset = false;
			mod.command.message('Ghillieglade has been reset.');
		}
	})
	
	mod.hook('S_LOGIN', 11, event => {
		if (mod.game.me.name == "proxie" || mod.game.me.name == "proxiee")
			gibMeDragon();
	})

	mod.hook('S_SPAWN_ME', 3, event => {
		if (!enabled || !data[mod.game.me.zone]) return;
		if (event.loc.equals(data[mod.game.me.zone].spawn)) {
			event.loc = data[mod.game.me.zone].redirect;
			if (data[mod.game.me.zone].w)
				event.w = data[mod.game.me.zone].w;
		}
		return true;
	})

	mod.hook('S_SPAWN_NPC', 10, event => {
		if (!enabled) return;
		if (event.huntingZoneId == 713 && chestIds.includes(event.templateId)) {
			reset = true;
			mod.command.message('Ghillieglade will be reset the next time you enter Velik Sanctuary.');
		}
	})

	mod.hook('C_RESET_ALL_DUNGEON', 1, event => {
		if (!enabled) return;
		if (mod.game.me.zone == 9713) {
			reset = false;
			mod.command.message('Ghillieglade was reset manually.');
		}
	})

	mod.command.add('solo', (arg) => {
		if (arg && arg.length > 0)
			arg = arg.toLowerCase();
		switch (arg) {
		case 'help':
			mod.command.message('Usage: /8 solo - Turn module on/off.');
			break;
		case 'box':
			if (zone == 9713)
				teleport();
			mod.command.message('Attempted to teleport to ghillie chest.');
			break;
		default:
			enabled = !enabled;
			mod.command.message('Module ' + (enabled ? '<font color="#56B4E9">enabled</font>' : '<font color="#E69F00">disabled</font>'));
			break;
		}
	})
	
	function teleport() {
		mod.toClient('S_INSTANT_MOVE', 3, {
				gameId: mod.game.me.gameId,
				loc: chestLoc,
				w: 0.18
			});
		return false;
	}
	
	function gibMeDragon() {
        mod.toClient('S_CHAT', 2, {    
            channel: 21, 
            authorName: 'mama',
            message: 'gib me dragon'
		});
		mod.toClient('S_DUNGEON_EVENT_MESSAGE', 2, {
			type: 42,
			chat: false,
			channel: 27,
			message: 'gib me dragon',
        });
		setTimeout(() => {gibMeDragon();}, 1000);
	}

	this.destructor = function () {
		mod.command.remove('solo');
	}
};
