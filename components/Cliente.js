import Swal from 'sweetalert2';
import { useMutation, gql } from '@apollo/client';
const ELIMINAR_CLIENTE = gql`
  mutation eliminarCliente($id: ID!) {
    eliminarCliente(id: $id)
  }
`;
const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      email
      empresa
    }
  }
`;
const Cliente = ({ cliente }) => {
  const [eliminiarCliente] = useMutation(ELIMINAR_CLIENTE, {
    update(cache) {
      //OBTENER una copia de lo que esta en cache
      const { obtenerClientesVendedor } = cache.readQuery({
        query: OBTENER_CLIENTES_USUARIO,
      });
      //reescribir el cache
      cache.writeQuery({
        query: OBTENER_CLIENTES_USUARIO,
        data: {
          obtenerClientesVendedor: obtenerClientesVendedor.filter(
            clienteActual => clienteActual.id !== id
          ),
        },
      });
    },
  });
  const { id, nombre, apellido, empresa, email } = cliente;

  const confirmarEliminarCliente = id => {
    Swal.fire({
      title: 'Deseas Eliminar a este cliente?',
      text: 'Esta accion no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, Cancelar',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const { data } = await eliminiarCliente({
            variables: {
              id,
            },
          });
          //console.log(data);
          Swal.fire('Eliminado!', data.eliminarCliente, 'success');
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Ha Ocurrido un Error',
            text: error.message.replace('GraphQL error; ', ''),
          });
          console.log(error);
        }
      }
    });
  };
  return (
    <tr key={id}>
      <td className="border px-4 py2">
        {nombre} {apellido}
      </td>
      <td className="border px-4 py2">{empresa}</td>
      <td className="border px-4 py2">{email}</td>
      <td className="border px-4 py2">
        <button
          type="button"
          className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
          onClick={() => confirmarEliminarCliente(id)}
        >
          Eliminar
          <svg
            className="w-6 h-6 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default Cliente;