const ErrorMessage = ({ message }: { message: string }) => {
  if (message) {
    return <p className="text-red-500">{message}</p>;
  }
  return null;
};
export default ErrorMessage;
