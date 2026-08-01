// Mini Matrix Methods Library
// (c) Tilman Roeder 2019
// MIT License: https://opensource.org/licenses/MIT

function Matrix(width, height, values) {
  // Values
  this.w = width;
  this.h = height;
  this.v = values;
}

// Methods
Matrix.prototype.get = function (i, j) {
  if (i < 0 || i >= this.h || j < 0 || j >= this.w) {
    throw new Error("Index out of range. Remember that Matrix is 0 indexed.");
  }
  return this.v[i * this.w + j];
};
Matrix.prototype.add = function (mat) {
  if (this.w !== mat.w || this.h !== mat.h) {
    throw new Error("Matrix dimensions do not match.");
  }
  var values = [];
  for (var i = 0; i < this.h; i++) {
    for (var j = 0; j < this.w; j++) {
      values.push(this.get(i, j) + mat.get(i, j));
    }
  }
  return new Matrix(this.w, this.h, values);
};
Matrix.prototype.mul = function (mat) {
  if (this.w !== mat.h) {
    throw new Error("Matrix dimensions do not match.");
  }
  var values = [];
  for (var i = 0; i < this.h; i++) {
    for (var j = 0; j < mat.w; j++) {
      var val = 0;
      for (var k = 0; k < this.w; k++) {
        val += this.get(i, k) * mat.get(k, j);
      }
      values.push(val);
    }
  }
  return new Matrix(mat.w, this.h, values);
};
Matrix.prototype.pow = function (n) {
  if (this.w !== this.h) {
    throw new Error("Matrix must be square.");
  }
  var res = Matrix.unity(this.w);
  for (var i = 0; i < n; i++) {
    res = res.mul(this);
  }
  return res;
};
Matrix.prototype.transpose = function () {
  var values = [];
  for (var i = 0; i < this.w; i++) {
    for (var j = 0; j < this.h; j++) {
      values.push(this.get(j, i));
    }
  }
  return new Matrix(this.h, this.w, values);
};
Matrix.prototype.pointwise = function (f) {
  var values = [];
  for (var i = 0; i < this.h; i++) {
    for (var j = 0; j < this.w; j++) {
      values.push(f(this.get(i, j)));
    }
  }
  return new Matrix(this.w, this.h, values);
};
Matrix.prototype.view = function (width, height) {
  // This shares the underlying memory
  if (this.w * this.h !== width * height) {
    throw new Error("Matrix dimensions do not match.");
  }
  return new Matrix(width, height, this.v);
};
Matrix.prototype.toString = function () {
  var result = "";
  for (var i = 0; i < this.h; i++) {
    result = result.concat(
      this.v.slice(i * this.w, (i + 1) * this.w).join(" "),
    );
    if (i + 1 < this.h) {
      result += "\n";
    }
  }
  return result;
};

// Pointwise functions
Matrix.relu = function (x) {
  return x > 0 ? x : 0;
};
Matrix.sigmoid = function (x) {
  return 1 / (1 + Math.exp(-x));
};

// Creation ops
Matrix.full = function (width, height, value) {
  return (new Matrix(width, height, [])).pointwise(function () {
    return value;
  });
};
Matrix.zeros = function (width, height) {
  return Matrix.full(width, height, 0);
};
Matrix.unity = function (size) {
  var m = Matrix.zeros(size, size);
  for (var i = 0; i < size; i++) {
    m.v[i * size + i] = 1;
  }
  return m;
};

// Random sampling
Matrix.rand = function (width, height) {
  return (new Matrix(width, height, [])).pointwise(function () {
    return Math.random();
  });
};
Matrix.randn = function (width, height) {
  // Centered, unit-variate, point-wise normal using Box-Mueller transform
  return (new Matrix(width, height, [])).pointwise(function () {
    var u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  });
};
