/* Fluid */
if(process.browser) {
  (function (w) {
    var canvas, ctx;
    var mouse = {
      x: 0,
      y: 0,
      px: 0,
      py: 0,
      down: false
    };
    var canvas_width = Math.ceil(document.documentElement.clientWidth / 100) * 100;
    var canvas_height = Math.ceil(document.documentElement.clientHeight / 100) * 100;
    var resolution = 100;
    var pen_size = 100;
    var num_cols = canvas_width / resolution;
    var num_rows = canvas_height / resolution;
    var speck_count = 3000;
    var vec_cells = [];
    var particles = [];

    function init() {
      canvas = document.createElement('canvas');
      canvas.setAttribute('id', 'pobel-animated-canvas');
      //console.log(document.querySelector('body').childNodes[1])

      document.querySelector('#app').childNodes[0].prepend(canvas);

      let pobelApp = document.querySelector('#app');

      ctx = canvas.getContext("2d");
      canvas.width = canvas_width;
      canvas.height = canvas_height;
      for (let i = 0; i < speck_count; i++) {
        particles.push(new particle(Math.random() * canvas_width, Math.random() * canvas_height));
      }
      for (let col = 0; col < num_cols; col++) {
        vec_cells[col] = [];
        for (let row = 0; row < num_rows; row++) {
          var cell_data = new cell(col * resolution, row * resolution, resolution)
          vec_cells[col][row] = cell_data;
          vec_cells[col][row].col = col;
          vec_cells[col][row].row = row;
        }
      }
      for (let col = 0; col < num_cols; col++) {
        for (let row = 0; row < num_rows; row++) {
          var cell_data = vec_cells[col][row];
          var row_up = (row - 1 >= 0) ? row - 1 : num_rows - 1;
          var col_left = (col - 1 >= 0) ? col - 1 : num_cols - 1;
          var col_right = (col + 1 < num_cols) ? col + 1 : 0;
          var up = vec_cells[col][row_up];
          var left = vec_cells[col_left][row];
          var up_left = vec_cells[col_left][row_up];
          var up_right = vec_cells[col_right][row_up];
          cell_data.up = up;
          cell_data.left = left;
          cell_data.up_left = up_left;
          cell_data.up_right = up_right;
          up.down = vec_cells[col][row];
          left.right = vec_cells[col][row];
          up_left.down_right = vec_cells[col][row];
          up_right.down_left = vec_cells[col][row];
        }
      }
      w.addEventListener("mousedown", mouse_down_handler);
      w.addEventListener("touchstart", mouse_down_handler);
      w.addEventListener("mouseup", mouse_up_handler);
      w.addEventListener("touchend", touch_end_handler);
      // canvas.addEventListener("mousemove", mouse_move_handler);
      pobelApp.addEventListener("mousemove", mouse_move_handler);
      pobelApp.addEventListener("touchmove", touch_move_handler);
      // canvas.addEventListener("touchmove", touch_move_handler);
      // w.onload = draw;
      draw();
    }

    function update_particle() {
      for (let i = 0; i < particles.length; i++) {
        var p = particles[i];
        if (p.x >= 0 && p.x < canvas_width && p.y >= 0 && p.y < canvas_height) {
          var col = parseInt(p.x / resolution);
          var row = parseInt(p.y / resolution);
          var cell_data = vec_cells[col][row];
          var ax = (p.x % resolution) / resolution;
          var ay = (p.y % resolution) / resolution;
          p.xv += (1 - ax) * cell_data.xv * 0.05;
          p.yv += (1 - ay) * cell_data.yv * 0.05;
          p.xv += ax * cell_data.right.xv * 0.05;
          p.yv += ax * cell_data.right.yv * 0.05;
          p.xv += ay * cell_data.down.xv * 0.05;
          p.yv += ay * cell_data.down.yv * 0.05;
          p.x += p.xv;
          p.y += p.yv;
          var dx = p.px - p.x;
          var dy = p.py - p.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var limit = Math.random() * 0.5;
          if (dist > limit) {
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.px, p.py);
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + limit, p.y + limit);
            ctx.stroke();
          }
          p.px = p.x;
          p.py = p.y;
        } else {
          p.x = p.px = Math.random() * canvas_width;
          p.y = p.py = Math.random() * canvas_height;
          p.xv = 0;
          p.yv = 0;
        }
        p.xv *= 0.5;
        p.yv *= 0.5;
      }
    }

    function draw() {
      var mouse_xv = mouse.x - mouse.px;
      var mouse_yv = mouse.y - mouse.py;
      for (let i = 0; i < vec_cells.length; i++) {
        var cell_datas = vec_cells[i];
        for (let j = 0; j < cell_datas.length; j++) {
          var cell_data = cell_datas[j];
          if (mouse.down) {
            change_cell_velocity(cell_data, mouse_xv, mouse_yv, pen_size);
          }
          update_pressure(cell_data);
        }
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#ff639c";
      update_particle();
      for (let i = 0; i < vec_cells.length; i++) {
        var cell_datas = vec_cells[i];
        for (let j = 0; j < cell_datas.length; j++) {
          var cell_data = cell_datas[j];
          update_velocity(cell_data);
        }
      }
      mouse.px = mouse.x;
      mouse.py = mouse.y;

      requestAnimationFrame(draw);
    }

    function change_cell_velocity(cell_data, mvelX, mvelY, pen_size) {
      var dx = cell_data.x - mouse.x;
      var dy = cell_data.y - mouse.y;
      var dist = Math.sqrt(dy * dy + dx * dx);
      if (dist < pen_size) {
        if (dist < 4) {
          dist = pen_size;
        }
        var power = pen_size / dist;
        cell_data.xv += mvelX * power * 0.4;
        cell_data.yv += mvelY * power * 0.4;
      }
    }

    function update_pressure(cell_data) {
      var pressure_x = (cell_data.up_left.xv * 0.5 //Divided in half because it's diagonal
        + cell_data.left.xv + cell_data.down_left.xv * 0.5 //Same
        - cell_data.up_right.xv * 0.5 //Same
        - cell_data.right.xv - cell_data.down_right.xv * 0.5 //Same
      );
      var pressure_y = (cell_data.up_left.yv * 0.5 + cell_data.up.yv + cell_data.up_right.yv * 0.5 - cell_data.down_left.yv * 0.5 - cell_data.down.yv - cell_data.down_right.yv * 0.5);
      cell_data.pressure = (pressure_x + pressure_y) * 0.25;
    }

    function update_velocity(cell_data) {
      cell_data.xv += (cell_data.up_left.pressure * 0.5 + cell_data.left.pressure + cell_data.down_left.pressure * 0.5 - cell_data.up_right.pressure * 0.5 - cell_data.right.pressure - cell_data.down_right.pressure * 0.5) * 0.25;
      //This does the same for the Y axis.
      cell_data.yv += (cell_data.up_left.pressure * 0.5 + cell_data.up.pressure + cell_data.up_right.pressure * 0.5 - cell_data.down_left.pressure * 0.5 - cell_data.down.pressure - cell_data.down_right.pressure * 0.5) * 0.25;

      cell_data.xv *= .97;
      cell_data.yv *= .97;
    }

    //This function is used to create a cell object.
    function cell(x, y, res) {
      //This stores the position to place the cell on the canvas
      this.x = x;
      this.y = y;
      //This is the width and height of the cell
      this.r = res;
      //These are the attributes that will hold the row and column values
      this.col = 0;
      this.row = 0;
      //This stores the cell's velocity
      this.xv = 0;
      this.yv = 0;
      this.pressure = 0;
    }

    function particle(x, y) {
      this.x = this.px = x;
      this.y = this.py = y;
      this.xv = this.yv = 0;
    }

    function mouse_down_handler(e) {
      e.preventDefault();
      mouse.down = true;
    }

    function mouse_up_handler() {
      mouse.down = false;
    }

    function touch_end_handler(e) {
      if (!e.touches) mouse.down = false;
    }

    function mouse_move_handler(e) {
      // mouse.down = true;
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x = e.offsetX + 235 || e.layerX;
      mouse.y = e.offsetY + 230 || e.layerY;
    }

    function touch_move_handler(e) {
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].pageX - rect.left;
      mouse.y = e.touches[0].pageY - rect.top;
    }

    w.Fluid = {
      initialize: init
    }
  }(window));
  window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
//Fluid.initialize();
}
/* Fluid */
