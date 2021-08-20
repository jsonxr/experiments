// https://minecraft.fandom.com/wiki/Model
// https://minecraft.fandom.com/wiki/Tint

// biome temp/rainfal numbers... https://github.com/erich666/Mineways/blob/master/Win/biomes.cpp
// AdjTemp = clamp( Temperature, 0.0, 1.0 )
// AdjRainfall = clamp( Rainfall, 0.0, 1.0 ) * AdjTemp

export type Vector3 = [number, number, number];
export type Vector4 = [number, number, number, number];

export interface Face {
  uv: Vector4;
  texture: string;
  cullface: string;
  rotation: 0 | 90 | 180 | 270;
  tintindex: number;
}

export interface Element {
  from: Vector3;
  to: Vector3;
  rotation: {
    origin: Vector3;
    axis: 'x' | 'y' | 'z';
    angle: number;
    rescale: boolean;
  }
  shade: boolean;
  faces: {
    down?: Face;
    up?: Face;
    north?: Face;
    south?: Face;
    west?: Face;
    east?: Face;
  }
}

export interface Display {
  rotation: Vector3;
  translation: Vector3;
  scale: Vector3; // Max of 4
}

export interface Model {
  parent?: string | Model;
  ambientocclusion?: boolean;

  display?: {
    thirdperson_righthand?: Display;
    thirdperson_lefthand?: Display;
    firstperson_righthand?: Display;
    firstperson_lefthand?: Display;
    gui?: Display;
    head?: Display;
    ground?: Display;
    fixed?: Display;
  },

  textures?: Record<string, string>;
  elements?: Element[];
}
