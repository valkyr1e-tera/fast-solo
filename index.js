/**
 ** 9031 Akasha
 ** 9032 Baracos
 ** 9713 Ghillie
 ** 9777 Channelworks
 ** 7005 Velika
 **/

const Vec3 = require('tera-vec3');

module.exports = function EyyHanSoloLevelPragmatismFuckEthicsBitchSuckABigOneAyy(mod) {
	const chestIds = [81341, 81342];
	const data = {
		9031: { redirect: new Vec3(72416, 133868, -503) },
		9032: { redirect: new Vec3(28194, 179672, -1675) },
		9713: {
			spawn: new Vec3(54997, 116171, 4517),
			redirect: new Vec3(52230, 117225, 4352)
		},
		9777: {
			spawn: new Vec3(-121630, -41458, 2398),
			redirect: new Vec3(-112672, -35058, 410)
		},
		7005: {
			spawn: new Vec3(-481, 6301, 1956),
			redirect: new Vec3(-341, 8665, 2180)
		}
	};

	let enabled = true;
	let reset = false;

	let inAkasha,
	inBaracos;

	mod.game.me.on('change_zone', (zone) => {
		if (!enabled) return;
		inAkasha = (zone == 9031);
		inBaracos = (zone == 9032);
		if (zone == 9714 && reset) {
			mod.send('C_RESET_ALL_DUNGEON', 1, {});
			reset = false;
			mod.command.message('Ghillieglade has been reset.');
		}
	})

	mod.hook('S_SPAWN_ME', 3, event => {
		if (!enabled || !data[mod.game.me.zone]) return;
		if (event.loc.equals(data[mod.game.me.zone].spawn) || inAkasha || inBaracos)
			event.loc = data[mod.game.me.zone].redirect;
		return true;
	})

	mod.hook('S_SPAWN_NPC', 9, event => {
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

	mod.command.add('solo', {
		$default() {
			mod.command.message('Usage: /8 solo - Turn module on/off.');
		},
		$none() {
			enabled = !enabled;
			mod.command.message('Module ' + (enabled ? '<font color="#56B4E9">enabled</font>' : '<font color="#E69F00">disabled</font>'));
		},
	})

	this.destructor = function () {
		mod.command.remove('solo');
	}
};
