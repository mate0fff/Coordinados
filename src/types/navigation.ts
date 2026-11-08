export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type CronogramaStackParamList = {
  ListaEventos: undefined;
  DetalleEvento: { 
    id: string; 
    titulo: string; 
    fechaISO: string; 
    direccion: string; 
    descripcion: string; 
  };
};

export type RootTabParamList = {
  CronogramaTab: undefined;
  GastosTab: undefined;
};
