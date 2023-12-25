type dataConfig = {
  [year: string]: {
    [key: string]: {
      nb_comm: number;
      pop_max: number;
      pop_min: number;
      pop_med: number;
    };
  };
};

const DataConfig: dataConfig = {
  "2020": {
    "chien": {
      nb_comm: 34033,
      pop_max: 28235,
      pop_min: 1,
      pop_med: 129,

    },
    "chat": {
      nb_comm: 33569,
      pop_max: 44302,
      pop_min: 1,
      pop_med: 49,
    },
  },
   "2019": {
    "chien": {
      nb_comm: 34225,
      pop_max: 28549,
      pop_min: 1,
      pop_med: 127.5,
    },
    "chat": {
      nb_comm: 33687,
      pop_max: 42441,
      pop_min: 1,
      pop_med: 46,
    },
  },
 "2018": {
    "chien": {
      nb_comm: 33847,
      pop_max: 28864,
      pop_min: 1,
      pop_med: 126,
    },
    "chat": {
      nb_comm: 33288,
      pop_max: 40581,
      pop_min: 1,
      pop_med: 43,
    },
  },
  "2017": {
    "chien": {
      nb_comm: 33821,
      pop_max: 28917,
      pop_min: 1,
      pop_med: 124,
    },
    "chat": {
      nb_comm: 33197,
      pop_max: 38582,
      pop_min: 1,
      pop_med: 39,
    },
  },
};

const getData = (year: string, key: string) => {
  if (DataConfig[year] && DataConfig[year][key]) {
    return DataConfig[year][key];
  }
  return {};
};

export { DataConfig, getData };
