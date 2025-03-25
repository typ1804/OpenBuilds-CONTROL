var framingWizardTemplate = `
    <form>
      <div class="row mb-2">
        <div class="cell-sm-7">
          <div class="row mb-2">
            <label class="cell-sm-6">Framing Bit Diameter</label>
            <div class="cell-sm-6">
              <input id="framingDiameter" type="number" data-role="input" data-append="mm" data-clear-button="false" value="22" data-editable="true">
            </div>
          </div>

          <div class="row mb-2">
            <label class="cell-sm-6">Feedrate</label>
            <div class="cell-sm-6">
              <input id="framingFeedrate" type="number" maxlength="5" data-role="input" data-append="mm/min" data-clear-button="false" value="800" data-editable="true"
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);">
            </div>
          </div>

          <div class="row mb-2 pb-2  border-bottom bd-gray">
            <label class="cell-sm-6">Spindle RPM</label>
            <div class="cell-sm-6">
              <input id="framingRPM" type="number" data-role="input" data-append="RPM" data-clear-button="false" value="1000" data-editable="true">
            </div>
          </div>

          <div class="row mb-2">
            <label class="cell-sm-6">Width<br> <small class="dark">X-Axis (width of leftover stock)</small></label>
            <div class="cell-sm-6">
              <input id="framingX" type="number" data-role="input" data-append="mm" data-clear-button="false" value="200" data-editable="true">
            </div>
          </div>

          <div class="row mb-2 border-bottom bd-gray">
            <label class="cell-sm-6">Length<br> <small class="dark">Y-Axis (length of leftover stock)</small></label>
            <div class="cell-sm-6">
              <input id="framingY" type="number" data-role="input" data-append="mm" data-clear-button="false" value="300" data-editable="true">
            </div>
          </div>

          <div class="row mb-2 pb-2 border-bottom bd-gray">
           <label class="cell-sm-6">Framing Sides</label>
           <div class="cell-sm-6">
             <select id="framingSides" data-role="input" data-clear-button="false">
               <option value="all" selected>Along all sides</option>
               
               <option value="left">Along left side only</option>
               <option value="top">Along top side only</option>
               <option value="right">Along right side only</option>
               <option value="bottom">Along bottom side only</option>
               
                <option value="leftRight">Along left and right side only</option>
                <option value="topBottom">Along top and bottom side only</option>
             </select>
           </div>
         </div>

          <div class="row mb-2">
            <label class="cell-sm-6">Cut Depth per Pass</label>
            <div class="cell-sm-6">
              <input id="framingDepth" type="number" data-role="input" data-append="mm" data-clear-button="false" value="2" data-editable="true">
            </div>
          </div>

          <div class="row mb-2 pb-2 border-bottom bd-gray">
            <label class="cell-sm-6  mb-2">Final Cut Depth</label>
            <div class="cell-sm-6">
              <input id="framingFinalDepth" type="number" data-role="input" data-append="mm" data-clear-button="false" value="2" data-editable="true">
            </div>
          </div>

          <div class="row mb-2 pb-2 border-bottom bd-gray">
            <label class="cell-sm-6">Enable Coolant/Vacuum</label>
            <div class="cell-sm-6">
              <select id="framingCoolant" data-role="input" data-clear-button="false">
                <option value="enabled" selected>Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>
        </div>
        <div class="cell-sm-5">
          <small class="dark">You can use the Framing Wizard to
            <ul class="dark">
              <li>Frame your stock</li>
              <li>Clean up sides</li>
            </ul>
          </small>
          <!-- maybe add a preview image here
          <hr>
          <center>
            <img src="img/framing/wizard1.png" alt="diameter" border="0" style="max-width: calc(100% - 10px); ">
          </center>
          -->
        </div>
      </div>
    </form>`

function populateFramingToolForm() {
    $("#gcode").empty();

    Metro.dialog.create({
        title: "<i class='fas fa-exchange-alt'></i> Framing Wizard",
        content: framingWizardTemplate,
        toTop: true,
        width: '90%',
        clsDialog: 'dark',
        actions: [
            {
                caption: "Cancel",
                cls: "js-dialog-close",
                onclick: function () {
                    console.log('cancel')
                }
            },
            {
                caption: "Proceed",
                cls: "js-dialog-close success",
                onclick: function () {
                    console.log('proceed')
                    createFramingGcode()
                }
            }
        ]
    });

    if (localStorage.getItem("lastFramingTool")) {
        var dataRaw = localStorage.getItem("lastFramingTool");
        var data = JSON.parse(dataRaw);

        console.log('storage config')
        console.dir(dataRaw)
        console.dir(data)
    } else {
        var data = {
            framingDiameter: 22,
            framingFeedrate: 800,
            framingX: 200,
            framingY: 300,
            framingDepth: 3,
            framingFinalDepth: 3,
            framingCoolant: "enabled",
            framingRPM: 1000,
            framingSides: "all"
        };

        console.log('default config')
        console.dir(data)
    }
    $("#framingDiameter").val(data.framingDiameter);
    $("#framingFeedrate").val(data.framingFeedrate);
    $("#framingX").val(data.framingX);
    $("#framingY").val(data.framingY);
    $("#framingDepth").val(data.framingDepth);
    if (data.framingFinalDepth !== undefined) {
        $("#framingFinalDepth").val(data.framingFinalDepth);
    } else {
        $("#framingFinalDepth").val(data.framingDepth);
    }
    if (data.framingCoolant !== undefined) {
        $('#framingCoolant').val(data.framingCoolant)
    }
    $('#framingRPM').val(data.framingRPM)
    if (data.framingSides !== undefined) {
        $('#framingSides').val(data.framingSides);
    }
}

function createFramingGcode() {
    var data = {
        framingDiameter: parseFloat($("#framingDiameter").val()),
        framingFeedrate: parseFloat($("#framingFeedrate").val()),
        framingX: parseFloat($("#framingX").val()),
        framingY: parseFloat($("#framingY").val()),
        framingDepth: parseFloat($("#framingDepth").val()),
        framingFinalDepth: parseFloat($("#framingFinalDepth").val()),
        framingRPM: parseFloat($('#framingRPM').val()),
        framingCoolant: $('#framingCoolant').val(),
        framingSides: $('#framingSides').val()
    };

    if (data.framingFinalDepth > data.framingDepth) {
        console.log("multipass")
    } else if (data.framingFinalDepth === data.framingDepth || data.framingFinalDepth < data.framingDepth) {
        console.log("singlepass")
        data.framingFinalDepth = data.framingDepth
    }

    console.log('store config');
    console.log(data);
    console.log(JSON.stringify(data));
    localStorage.setItem("lastFramingTool", JSON.stringify(data));

    var startpointX = 0 - data.framingDiameter;
    var endpointX = data.framingX + data.framingDiameter;

    var startpointY = 0 - data.framingDiameter;
    var endpointY = data.framingY + data.framingDiameter;

    var gcode =
        `; Framing Operation
; Endmill Diameter: ` +
        data.framingDiameter +
        `mm
; Feedrate: ` +
        data.framingFeedrate +
        `mm/min
; X: ` +
        data.framingX +
        `, Y: ` +
        data.framingY +
        `, Z: ` +
        data.framingDepth +
        `
G54; Work Coordinates
G21; mm-mode
G90; Absolute Positioning
M3 S` + data.framingRPM + `; Spindle On
`
    if (data.framingCoolant === "enabled") {
        gcode += `M8; Coolant On\n`
    }

    gcode += `G4 P1.8; Wait for spindle to come up to speed
G1 Z10; Move to Safe Height
G0 X0 Y0; Move to origin position
G1 F` +
        data.framingFeedrate + `; Set feedrate\n\n`;

    //gcode += `G0 X` + startpointX.toFixed(4) + ` Y` + startpointY.toFixed(4) + `; move to framing start point\n\n`;

    // MULTIPASS
    var counter = 1;
    for (q = data.framingDepth; q < data.framingFinalDepth + data.framingDepth; q += data.framingDepth) {
        gcode += `; start of round ` + counter + `\n`;

        if (q > data.framingFinalDepth) {
            var zval = -data.framingFinalDepth;
        } else {
            var zval = -q
        }
        console.log(q, zval)

        if (data.framingSides === "all" || data.framingSides === "left" || data.framingSides === "leftRight") {
            gcode += `G1 Z10; lifting to Z safe height\n`;
            gcode += `G1 X` + startpointX.toFixed(4) + ` Y` + startpointY.toFixed(4) + `; move to left side\n`;

            // cut along left side
            gcode += `G1 Z` + zval + `; plunge to depth for this round\n`;
            gcode += `G1 X` + startpointX.toFixed(4) + ` Y` + endpointY.toFixed(4) + `; cut left side\n`;

            if (data.framingSides === "leftRight") {
                gcode += `G1 Z10; lifting to Z safe height\n`;
                gcode += `G1 X` + endpointX.toFixed(4) + ` Y` + endpointY.toFixed(4) + `; move to right side\n`;
            }
        }

        if (data.framingSides === "all" || data.framingSides === "top" || data.framingSides === "topBottom") {
            if (data.framingSides === "top" || data.framingSides === "topBottom") {
                gcode += `G1 Z10; lifting to Z safe height\n`;
                gcode += `G1 X` + startpointX.toFixed(4) + ` Y` + endpointY.toFixed(4) + `; move to top side\n`;
            }

            // cut along top side
            gcode += `G1 Z` + zval + `; plunge to depth for this round\n`;
            gcode += `G1 X` + endpointX.toFixed(4) + ` Y` + endpointY.toFixed(4) + `; cut top side\n`;

            if (data.framingSides === "topBottom") {
                gcode += `G1 Z10; lifting to Z safe height\n`;
                gcode += `G1 X` + endpointX.toFixed(4) + ` Y` + startpointY.toFixed(4) + `; cut bottom side\n`;
            }
        }

        if (data.framingSides === "all" || data.framingSides === "right" || data.framingSides === "leftRight") {
            if (data.framingSides === "right" || data.framingSides === "leftRight") {
                gcode += `G1 Z10; lifting to Z safe height\n`;
                gcode += `G1 X` + endpointX.toFixed(4) + ` Y` + endpointY.toFixed(4) + `; move to top right side\n`;
            }

            // cut along right side
            gcode += `G1 Z` + zval + `; plunge to depth for this round\n`;
            gcode += `G1 X` + endpointX.toFixed(4) + ` Y` + startpointY.toFixed(4) + `; cut right side\n`;
        }

        if (data.framingSides === "all" || data.framingSides === "bottom" || data.framingSides === "topBottom") {
            if (data.framingSides === "bottom" || data.framingSides === "topBottom") {
                gcode += `G1 Z10; lifting to Z safe height\n`;
                gcode += `G1 X` + endpointX.toFixed(4) + ` Y` + startpointY.toFixed(4) + `; move to bottom right side\n`;
            }

            // cut along bottom side
            gcode += `G1 Z` + zval + `; plunge to depth for this round\n`;
            gcode += `G1 X` + startpointX.toFixed(4) + ` Y` + startpointY.toFixed(4) + `; cut bottom side\n`;
        }

        counter++;
    }
    // END MULTIPASS

    gcode += `G1 Z10; pass complete, lifting to Z safe height\n\n`;
    gcode += `G0 X` + startpointX.toFixed(4) + ` Y` + startpointY.toFixed(4) + `; move to framing start point\n`;
    gcode += `M5 S0; Spindle Off\n`;

    if (data.framingCoolant === "enabled") {
        gcode += `M9; Coolant Off\n`
    }

    editor.session.setValue(gcode);
    parseGcodeInWebWorker(gcode)
    printLog("<span class='fg-red'>[ Framing Wizard ] </span><span class='fg-green'>GCODE Loaded</span>")
}