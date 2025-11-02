import {
  createWidget,
  edit_widget_group_type,
  sport_data,
  widget,
  align,
} from "@zos/ui";
import { getSportData } from "@zos/app-access";
import { SoundPlayer } from "@silver-zepp/easy-media";
import { Geolocation } from "@zos/sensor";

const player = new SoundPlayer();
const geolocation = new Geolocation();

DataWidget({
  state: {
    intervalId: null,
  },
  init() {
    const upWidget = createWidget(widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: 480,
      h: 240,
      color: 0x000000,
      // color: 0xffffff,
    });

    const downWidget = createWidget(widget.FILL_RECT, {
      x: 0,
      y: 480,
      w: 480,
      h: 240,
      // color: 0x000000,
      color: 0xffffff,
    });

    // Vitesse verticale
    const verticalSpeed = createWidget(widget.SPORT_DATA, {
      edit_id: 1,
      x: 0,
      w: 480,
      y: 0,
      h: 480,
      category: edit_widget_group_type.SPORTS,
      default_type: sport_data.SPEED_VERTICAL,
      rect_visible: false,
      sub_text_visible: false,
      text_size: 120,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
    });

    SoundPlayer.SetLogLevel(3);
    player.set.volume(100);

    function variometer() {
      getSportData(
        {
          type: "vertical_speed",
        },
        (callbackResult) => {
          const { code, data } = callbackResult;
          console.log("code for vertical_speed", code);
          if (code === 0) {
            console.log("vertical_speed", vertical_speed);
            const [{ vertical_speed }] = JSON.parse(data);
            if (vertical_speed > 0) {
              player.play("base.mp3");
              downWidget.setProperty(prop.More, { color: 0x000000 });
              upWidget.setProperty(prop.More, { color: 0xffffff });
              verticalSpeed.setProperty(prop.MORE, {
                y: 0,
                h: 240,
                color: 0x000000,
              });
            } else {
              downWidget.setProperty(prop.More, { color: 0xffffff });
              upWidget.setProperty(prop.More, { color: 0x000000 });
              verticalSpeed.setProperty(prop.MORE, {
                y: 240,
                h: 240,
                color: 0x000000,
              });
            }
          } else {
            console.log("code", code);
          }
        },
      );
    }

    this.intervalId = setInterval(variometer, 500);
  },

  build() {
    this.init();
  },
  onInit() {},

  onDestroy() {
    this.state.intervalId && clearInterval(this.state.intervalId);
  },
});
