import './toast.custom.scss';

interface IToastSuccess {
  message: string;
}

function ToastSuccess(props: IToastSuccess): JSX.Element {
  const { message } = props;
  return (
    <>
      <div className="toast-custom">
        <p className="toast-custom-text">{message}</p>
      </div>
    </>
  );
}

export default ToastSuccess;
