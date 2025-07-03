export default function ErrorScreen({
  title = "Error",
  message,
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center px-4 bg-zinc-950 text-zinc-100">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-red-400">
        {title}
      </h1>
      <p className="text-zinc-400 max-w-md">
        {message ?? "Sorry, something went wrong. Please try again later."}
      </p>
    </div>
  );
}
