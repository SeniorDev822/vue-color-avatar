import type { BeardShape, EarringsShape, GlassesShape } from '@/enums'
import type { AvatarOption, None } from '@/types'

import { NONE, SETTINGS, SPECIAL_AVATARS } from './constant'

/**
 * get a random value from an array
 */
function getRandomValue<Item = unknown>(
  arr: Item[],
  {
    avoid = [],
    usually = [],
  }: { avoid?: unknown[]; usually?: (Item | 'none')[] } = {}
): Item {
  const avoidValues = avoid.filter(Boolean)
  const filteredArr = arr.filter((it) => !avoidValues.includes(it))

  const usuallyValues = usually
    .filter(Boolean)
    .reduce<Item[]>((acc, cur) => acc.concat(new Array(15).fill(cur)), [])

  const finalArr = filteredArr.concat(usuallyValues)

  const randomIdx = Math.floor(Math.random() * finalArr.length)
  const randomValue = finalArr[randomIdx]

  return randomValue
}

export function getRandomAvatarOption(
  presetOption: Partial<AvatarOption> = {},
  useOption: Partial<AvatarOption> = {}
): AvatarOption {
  const avatarOption: AvatarOption = {
    wrapperShape:
      presetOption?.wrapperShape || getRandomValue(SETTINGS.wrapperShape),

    background: {
      color: getRandomValue(SETTINGS.backgroundColor, {
        avoid: [useOption.background?.color],
      }),
    },

    widgets: {
      face: {
        shape: getRandomValue(SETTINGS.faceShape),
      },
      tops: {
        shape: getRandomValue(SETTINGS.topsShape, {
          avoid: [useOption.widgets?.tops?.shape],
        }),
      },
      ear: {
        shape: getRandomValue(SETTINGS.earShape, {
          avoid: [useOption.widgets?.ear?.shape],
        }),
      },
      earrings: {
        shape: getRandomValue<EarringsShape | None>(SETTINGS.earringsShape, {
          usually: [NONE],
        }),
      },
      eyebrows: {
        shape: getRandomValue(SETTINGS.eyebrowsShape, {
          avoid: [useOption.widgets?.eyebrows?.shape],
        }),
      },
      eyes: {
        shape: getRandomValue(SETTINGS.eyesShape, {
          avoid: [useOption.widgets?.eyes?.shape],
        }),
      },
      nose: {
        shape: getRandomValue(SETTINGS.noseShape, {
          avoid: [useOption.widgets?.nose?.shape],
        }),
      },
      glasses: {
        shape: getRandomValue<GlassesShape | None>(SETTINGS.glassesShape, {
          usually: [NONE],
        }),
      },
      mouth: {
        shape: getRandomValue(SETTINGS.mouthShape, {
          avoid: [useOption.widgets?.mouth?.shape],
        }),
      },
      beard: {
        shape: getRandomValue<BeardShape | None>(SETTINGS.beardShape, {
          usually: [NONE],
        }),
      },
      clothes: {
        shape: getRandomValue(SETTINGS.clothesShape, {
          avoid: [useOption.widgets?.clothes?.shape],
        }),
      },
    },
  }

  return avatarOption
}

export function getSpecialAvatarOption() {
  return SPECIAL_AVATARS[Math.floor(Math.random() * SPECIAL_AVATARS.length)]
}

export function showConfetti() {
  import('canvas-confetti').then((confetti) => {
    const canvasEle: HTMLCanvasElement | null =
      document.querySelector('#confetti')

    if (!canvasEle) {
      return
    }

    const myConfetti = confetti.create(canvasEle, {
      resize: true,
      useWorker: true,
      disableForReducedMotion: true,
    })

    const duration = performance.now() + 1 * 1000

    const colors = SETTINGS.backgroundColor.slice(1, 4)

    void (function frame() {
      myConfetti({
        particleCount: colors.length,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      })
      myConfetti({
        particleCount: colors.length,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      })

      if (performance.now() < duration) {
        requestAnimationFrame(frame)
      }
    })()
  })
}

export function highlightJSON(json: string): string {
  if (!json) {
    return ''
  }

  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2)
  }

  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = ''
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key'
        } else {
          cls = 'string'
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean'
      } else if (/null/.test(match)) {
        cls = 'null'
      } else {
        cls = 'number'
      }
      return `<span class="token ${cls}">${match}</span>`
    }
  )
}
