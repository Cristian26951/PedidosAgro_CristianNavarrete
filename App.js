import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
} from "react-native";

const NOMBRE_EMPRESA = "AgroPedidos";
const COLOR_PLACEHOLDER = "#b5b0a0";
const TIENE_LETRAS = /[A-Za-zÁÉÍÓÚáéíóúÑñ]/;

const formatearPesos = (valor) => {
  return "$" + String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const validarPedido = (cliente, producto, cantidad, precio) => {
  const nombreLimpio = cliente.trim();
  const productoLimpio = producto.trim();
  const cantidadLimpia = cantidad.trim();
  const precioLimpio = precio.trim().replace(/^\$\s*/, "");

  if (nombreLimpio === "" || !TIENE_LETRAS.test(nombreLimpio)) {
    return { error: "Debe ingresar el nombre del cliente" };
  }
  if (productoLimpio === "" || !TIENE_LETRAS.test(productoLimpio)) {
    return { error: "Debe ingresar un producto" };
  }
  if (!/^\d+$/.test(cantidadLimpia) || Number(cantidadLimpia) <= 0) {
    return { error: "Ingrese una cantidad válida" };
  }

  const precioValido =
    /^\d+$/.test(precioLimpio) || /^\d{1,3}(\.\d{3})+$/.test(precioLimpio);
  const precioNum = Number(precioLimpio.replace(/\./g, ""));
  if (!precioValido || precioNum <= 0) {
    return { error: "Ingrese un precio unitario válido" };
  }

  const cantidadNum = Number(cantidadLimpia);
  return {
    pedido: {
      cliente: nombreLimpio,
      producto: productoLimpio,
      cantidad: cantidadNum,
      precio: precioNum,
      total: cantidadNum * precioNum,
    },
  };
};

export default function App() {
  const [cliente, setCliente] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [ultimoPedido, setUltimoPedido] = useState(null);
  const [contador, setContador] = useState(0);

  const registrarPedido = () => {
    const resultado = validarPedido(cliente, producto, cantidad, precio);

    if (resultado.error) {
      setMensaje(resultado.error);
      setTipoMensaje("error");
      setUltimoPedido(null);
      return;
    }

    setUltimoPedido(resultado.pedido);
    setMensaje("Pedido registrado correctamente");
    setTipoMensaje("exito");
    setContador(contador + 1);
  };

  const limpiarFormulario = () => {
    setCliente("");
    setProducto("");
    setCantidad("");
    setPrecio("");
    setMensaje("");
    setTipoMensaje("");
    setUltimoPedido(null);
  };

  return (
    <View style={styles.contenedor}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contenido}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.encabezado}>
          <Text style={styles.titulo}>🐮{NOMBRE_EMPRESA}🐮</Text>
          <Text style={styles.bienvenida}>
            Bienvenido a AgroPedidos. Registre aquí los pedidos de sus clientes.
          </Text>
        </View>

        <View style={styles.formulario}>
          <Text style={styles.etiqueta}>Nombre del cliente</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: María Rodríguez"
            placeholderTextColor={COLOR_PLACEHOLDER}
            value={cliente}
            onChangeText={setCliente}
          />

          <Text style={styles.etiqueta}>Producto solicitado</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Bulto de papa criolla"
            placeholderTextColor={COLOR_PLACEHOLDER}
            value={producto}
            onChangeText={setProducto}
          />

          <Text style={styles.etiqueta}>Cantidad (unidades)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 5"
            placeholderTextColor={COLOR_PLACEHOLDER}
            keyboardType="numeric"
            maxLength={6}
            value={cantidad}
            onChangeText={setCantidad}
          />

          <Text style={styles.etiqueta}>Precio unitario (COP)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 3000"
            placeholderTextColor={COLOR_PLACEHOLDER}
            keyboardType="numeric"
            maxLength={12}
            value={precio}
            onChangeText={setPrecio}
          />

          <View style={styles.fila}>
            <View style={styles.boton}>
              <Button
                title="Registrar pedido"
                color="#339bbb"
                onPress={registrarPedido}
              />
            </View>
            <View style={styles.boton}>
              <Button
                title="Limpiar"
                color="#b43e2f"
                onPress={limpiarFormulario}
              />
            </View>
          </View>
        </View>

        {mensaje !== "" && (
          <View
            style={[
              styles.mensajeCaja,
              tipoMensaje === "error" ? styles.cajaError : styles.cajaExito,
            ]}
          >
            <Text
              style={
                tipoMensaje === "error" ? styles.textoError : styles.textoExito
              }
            >
              {mensaje}
            </Text>

            {ultimoPedido !== null && (
              <View style={styles.resumen}>
                <Text style={styles.lineaResumen}>
                  Cliente: {ultimoPedido.cliente}
                </Text>
                <Text style={styles.lineaResumen}>
                  Producto: {ultimoPedido.producto}
                </Text>
                <Text style={styles.lineaResumen}>
                  Cantidad: {ultimoPedido.cantidad}
                </Text>
                <Text style={styles.lineaResumen}>
                  Precio unitario: {formatearPesos(ultimoPedido.precio)}
                </Text>
                <Text style={styles.total}>
                  Total: {formatearPesos(ultimoPedido.total)}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.pie}>
        <Text style={styles.contadorTexto}>
          Pedidos válidos en esta sesión: {contador}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#f3efe4",
  },
  scroll: {
    flex: 1,
  },
  contenido: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  encabezado: {
    backgroundColor: "#5b9ca1",
    alignItems: "center",
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fdfaf0",
  },
  bienvenida: {
    fontSize: 14,
    color: "#dfe9d4",
    marginTop: 4,
  },
  formulario: {
    marginBottom: 8,
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3b3a30",
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#b9b29b",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 16,
  },
  fila: {
    flexDirection: "row",
    marginTop: 16,
  },
  boton: {
    flex: 1,
    marginHorizontal: 4,
  },
  mensajeCaja: {
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
  },
  cajaError: {
    backgroundColor: "#fbe4e0",
    borderColor: "#c0392b",
  },
  cajaExito: {
    backgroundColor: "#e3f1dc",
    borderColor: "#2f6b3a",
  },
  textoError: {
    color: "#a5281b",
    fontWeight: "bold",
    fontSize: 15,
  },
  textoExito: {
    color: "#1f4d28",
    fontWeight: "bold",
    fontSize: 15,
  },
  resumen: {
    marginTop: 8,
  },
  lineaResumen: {
    fontSize: 14,
    color: "#2b2b24",
    marginBottom: 2,
  },
  total: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1f4d28",
    marginTop: 4,
  },
  pie: {
    paddingTop: 12,
    paddingBottom: 26,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#d6cfb8",
    backgroundColor: "#f3efe4",
  },
  contadorTexto: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3b3a30",
  },
});
