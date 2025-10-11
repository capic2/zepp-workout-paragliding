import { createWidget, widget, sport_data, edit_widget_group_type } from '@zos/ui'
import { getSportData } from '@zos/app-access'
import { SoundPlayer } from '@silver-zepp/easy-media';
import { Geolocation } from '@zos/sensor'

const player =new SoundPlayer();
const geolocation = new Geolocation()

DataWidget({
    state: {
        intervalId: null
    },
  init() {
    const bg = createWidget(widget.IMG, {
      x: 0,
      y: 0,
      src: 'bg.png'
    })

    // Vitesse verticale
    const verticalSpeed = createWidget(widget.SPORT_DATA, {
      edit_id: 1,
      x: 160,
      y: 310,
      w: 104,
      h: 120,
      category: edit_widget_group_type.SPORTS,
      default_type: sport_data.SPEED_VERTICAL,
      rect_visible: false,
      sub_text_visible: false,
    })
    const varVerticalSpeed = createWidget(widget.TEXT, {
        edit_id: 2,
        x: 200,
        y: 310,
        w: 104,
        h: 120,
        text: '0'
    })

      SoundPlayer.SetLogLevel(3);
      player.set.volume(100);

      return {verticalSpeed}
  },

  build() {
    const {verticalSpeed} = this.init();

    this.setInterval(() => {
        getSportData(
            {
                type: 'vertical_speed',
            },
            (callbackResult) => {
                const {code, data} = callbackResult
                if (code === 0) {
                    const [{vertical_speed}] = JSON.parse(data)
                    varVerticalSpeed.setProperty(prop.More, {text: vertical_speed})
                    if (vertical_speed > 0) {
                        console.log('vertical_speed', vertical_speed)
                        player.play('sfx2.mp3')
                    } else {
                        console.log('vertical_speed', vertical_speed)
                    }
                }
            },
        )
    }, 500)

  },
  onInit() {},

  onDestroy() {
      this.intervalId && clearInterval(this.state.intervalId)
  }
})
