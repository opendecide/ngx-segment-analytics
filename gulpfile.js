/* eslint-disable */
const path = require('path'),
  ngc = require('@angular/compiler-cli/src/main').main,
  rollup = require('gulp-rollup'),
  del = require('del'),
  inlineResources = require('./tools/gulp/inline-resources');

const { watch, series, parallel, src, dest } = require('gulp');

const rootFolder = path.join(__dirname);
const srcFolder = path.join(rootFolder, 'src');
const tmpFolder = path.join(rootFolder, '.tmp');
const buildFolder = path.join(rootFolder, 'build');
const distFolder = path.join(rootFolder, 'dist');

/**
 * 1. Delete /dist folder
 */
function cleanDist() {
  return deleteFolders([distFolder]);
}

/**
 * 2. Clone the /src folder into /.tmp. If an npm link inside /src has been made,
 *    then it's likely that a node_modules folder exists. Ignore this folder
 *    when copying to /.tmp.
 */
function copySource() {
  return src([`${srcFolder}/**/*`, `!${srcFolder}/node_modules`])
    .pipe(dest(tmpFolder));
}

/**
 * 3. Inline template (.html) and style (.css) files into the the component .ts files.
 *    We do this on the /.tmp folder to avoid editing the original /src files
 */
function inlineRes() {
   return inlineResources(tmpFolder);
}


/**
 * 4. Run the Angular compiler, ngc, on the /.tmp folder. This will output all
 *    compiled modules to the /build folder.
 */
function angularCompile() {
  return ngc({
    project: `${tmpFolder}/tsconfig.es5.json`
  })
    .then((exitCode) => {
      if (exitCode === 1) {
        // This error is caught in the 'compile' task by the runSequence method callback
        // so that when ngc fails to compile, the whole compile process stops running
        throw new Error('ngc compilation failed');
      }
  });
}

/**
 * 5. Run rollup inside the /build folder to generate our Flat ES module and place the
 *    generated file into the /dist folder
 */
function rollupBuild() {
  return src(`${buildFolder}/**/*.js`)
  // transform the files here.
    .pipe(rollup({
      // any option supported by Rollup can be set here.
      input: `${buildFolder}/index.js`,
      output: {
        format: 'es',
      },
      external: [
        '@angular/core',
        '@angular/common'
      ]
    }))
    .pipe(dest(distFolder));
}

/**
 * 6. Copy all the files from /build to /dist, except .js files. We ignore all .js from /build
 *    because with don't need individual modules anymore, just the Flat ES module generated
 *    on step 5.
 */
function copyBuild() {
  return src([`${buildFolder}/**/*`, `!${buildFolder}/**/*.js`])
    .pipe(dest(distFolder));
}

/**
 * 7. Copy package.json from /src to /dist
 */
function copyManifest() {
  return src([`${srcFolder}/package.json`])
    .pipe(dest(distFolder));
}

/**
 * 8. Copy README.md from /src to /dist
 */
function copyReadme() {
  return src([`${srcFolder}/README.md`])
    .pipe(dest(distFolder));
}

/**
 * 9. Delete /.tmp folder
 */
function cleanTmp() {
  return deleteFolders([tmpFolder]);
}

/**
 * 10. Delete /build folder
 */
function cleanBuild() {
  return deleteFolders([buildFolder]);
}

/**
 * Deletes the specified folder
 */
function deleteFolders(folders) {
  return del(folders);
}

function watchSrc() {
  return watch(`${srcFolder}/**/*`, exports.build);
}

exports.clean = parallel(cleanDist, cleanTmp, cleanBuild);
exports.build = series(
  exports.clean,
  series(
    copySource,
    inlineRes,
    angularCompile,
    rollupBuild,
    copyBuild,
    copyManifest,
    copyReadme,
    cleanBuild,
    cleanTmp
  )
);
exports.watch = watchSrc;
exports.buildWatch = series(exports.build, exports.watch);
exports.default = exports.buildWatch;
