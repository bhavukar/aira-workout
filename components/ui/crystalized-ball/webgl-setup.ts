import { Renderer, Program, Mesh, Triangle, Geometry, RenderTarget, Texture } from 'ogl';
import {
  MAX_ARCS,
  STATE_WIDTH,
  buildStrands,
} from './palette';
import {
  passVertex,
  fieldFragment,
  dustVertex,
  dustFragment,
  stirFragment,
  compositeFragment,
} from './shaders';

export function setupCrystalizedWebGL(gl: any, halfFloat: boolean, fullFloat: boolean) {
  const encode = halfFloat ? 1 : 0.25;
  const geometry = new Triangle(gl);
  const blank = new Texture(gl);
  const strandData = buildStrands();

  const sceneTarget = new RenderTarget(gl, {
    width: 1,
    height: 1,
    depth: false,
    type: halfFloat ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE,
    format: gl.RGBA,
    internalFormat: halfFloat ? gl.RGBA16F : gl.RGBA,
    minFilter: gl.NEAREST,
    magFilter: gl.NEAREST,
  });

  const arcData = new Array(MAX_ARCS * 4).fill(0);
  const fieldUniforms: any = {
    uCenter: { value: [0, 0] },
    uRadius: { value: 1 },
    uDpr: { value: 1 },
    uLine: { value: 0.6 },
    uTime: { value: 0 },
    uFrame: { value: 0 },
    uBins: { value: 420 },
    uStrands: { value: 5 },
    uCrackle: { value: 0.6 },
    uFlares: { value: 0.5 },
    uGlow: { value: 0.8 },
    uHaze: { value: 0.7 },
    uFill: { value: 0.5 },
    uPresence: { value: 0 },
    uUnfold: { value: 0 },
    uBloom: { value: 0 },
    uInside: { value: 0 },
    uEncode: { value: encode },
    uRim: { value: [1, 1, 1] },
    uRimHot: { value: [1, 1, 1] },
    uRimMid: { value: [1, 1, 1] },
    uRimDeep: { value: [1, 1, 1] },
    uSpark: { value: [1, 1, 1] },
    uSparkGlow: { value: [1, 1, 1] },
    uHazeColor: { value: [0, 0, 0] },
    uEdgeColor: { value: [0, 0, 0] },
    uHeat: { value: [0, 0, 0, 0] },
    uHarmonics: { value: strandData.harmonics },
    uRates: { value: strandData.rates },
    uPhases: { value: strandData.phases },
    uFlareHarmonics: { value: strandData.flareHarmonics },
    uFlareRates: { value: strandData.flareRates },
    uFlarePhases: { value: strandData.flarePhases },
    uArcs: { value: arcData },
  };

  const dustShared: any = {
    uDustTime: { value: 0 },
    uTurn: { value: [0, 0] },
    uMotion: { value: 0 },
    uFill: fieldUniforms.uFill,
    tHome: { value: blank },
    tSeed: { value: blank },
  };

  const dustUniforms: any = {
    ...dustShared,
    tOffset: { value: blank },
    uStirred: { value: 0 },
    uCenter: fieldUniforms.uCenter,
    uViewport: { value: [1, 1] },
    uRadius: fieldUniforms.uRadius,
    uDpr: fieldUniforms.uDpr,
    uDepth: { value: 0.6 },
    uTwinkle: { value: 0.5 },
    uPointScale: { value: 1 },
    uReveal: { value: 0 },
    uEncode: { value: encode },
    uTones: { value: new Array(15).fill(1) },
    uRimTone: { value: [1, 1, 1] },
    uShape: { value: 0 },
  };

  const stirUniforms: any = {
    ...dustShared,
    tOffset: { value: blank },
    tVelocity: { value: blank },
    uDt: { value: 0.016 },
    uReset: { value: 1 },
    uBrush: { value: [0, 0, 0, 0] },
    uBrushPower: { value: 0 },
    uKick: { value: [0, 0, 0, 0] },
  };

  const compositeUniforms: any = {
    tScene: { value: sceneTarget.texture },
    uLight: { value: 0 },
    uDecode: { value: 1 / encode },
  };

  const additive = (program: any) => {
    program.setBlendFunc(gl.ONE, gl.ONE);
    return program;
  };

  const fieldMesh = new Mesh(gl, {
    geometry,
    program: additive(
      new Program(gl, {
        vertex: passVertex,
        fragment: fieldFragment,
        uniforms: fieldUniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      })
    ),
  });

  const dustProgram = additive(
    new Program(gl, {
      vertex: dustVertex,
      fragment: dustFragment,
      uniforms: dustUniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })
  );

  const stirMesh = halfFloat
    ? new Mesh(gl, {
        geometry,
        program: new Program(gl, {
          vertex: passVertex,
          fragment: stirFragment,
          uniforms: stirUniforms,
          depthTest: false,
          depthWrite: false,
        }),
      })
    : null;

  const compositeMesh = new Mesh(gl, {
    geometry,
    program: new Program(gl, {
      vertex: passVertex,
      fragment: compositeFragment,
      uniforms: compositeUniforms,
      depthTest: false,
      depthWrite: false,
    }),
  });

  return {
    blank,
    sceneTarget,
    fieldUniforms,
    dustShared,
    dustUniforms,
    stirUniforms,
    compositeUniforms,
    fieldMesh,
    dustProgram,
    stirMesh,
    compositeMesh,
    arcData,
  };
}

export const disposeTarget = (gl: any, target: any) => {
  if (!target) return;
  gl.deleteFramebuffer(target.buffer);
  target.textures?.forEach((texture: any) => gl.deleteTexture(texture.texture));
};

export const createStateTarget = (gl: any, fullFloat: boolean, rows: number) =>
  new RenderTarget(gl, {
    width: STATE_WIDTH,
    height: rows,
    color: 2,
    depth: false,
    type: fullFloat ? gl.FLOAT : gl.HALF_FLOAT,
    format: gl.RGBA,
    internalFormat: fullFloat ? gl.RGBA32F : gl.RGBA16F,
    minFilter: gl.NEAREST,
    magFilter: gl.NEAREST,
  });

export const createDataTexture = (gl: any, data: any, rows: number) =>
  new Texture(gl, {
    image: data,
    width: STATE_WIDTH,
    height: rows,
    type: gl.FLOAT,
    format: gl.RGBA,
    internalFormat: gl.RGBA32F,
    minFilter: gl.NEAREST,
    magFilter: gl.NEAREST,
    generateMipmaps: false,
    flipY: false,
  });
