const Vec3 = require('tera-vec3')

module.exports = function FastSolo(mod) {
  const chestIds = [81341, 81342]
  const data = {
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
  }

  let enabled = true
  let reset = false

  mod.game.me.on('change_zone', zone => {
    if (!enabled)
      return

    if (zone === 9714 && reset) {
      mod.send('C_RESET_ALL_DUNGEON', 1, {})
      reset = false
      mod.command.message('Ghillieglade has been reset.')
    }
  })

  mod.hook('S_SPAWN_ME', 3, event => {
    const zoneInfo = data[mod.game.me.zone]
    if (!enabled || !zoneInfo)
      return

    if (event.loc.equals(zoneInfo.spawn)) {
      event.loc = zoneInfo.redirect
      if (zoneInfo.w)
        event.w = zoneInfo.w
    }
    return true
  })

  mod.hook('S_SPAWN_NPC', 11, event => {
    if (!enabled)
      return

    if (event.huntingZoneId === 713 && chestIds.includes(event.templateId))
      reset = true
  })

  mod.hook('C_RESET_ALL_DUNGEON', 1, () => {
    if (!enabled)
      return

    if (mod.game.me.zone == 9713)
      reset = false
  })

  mod.command.add('solo', () => {
    enabled = !enabled
    mod.command.message(`${enabled ? 'en': 'dis'}abled`)
  })
}
