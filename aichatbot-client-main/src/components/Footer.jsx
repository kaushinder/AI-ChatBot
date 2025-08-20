function Footer() {
  return (
    <footer className="w-full bg-transparent backdrop-blur-xs text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-center items-center">
        <p className="text-sm text-center">
          © {new Date().getFullYear()} AI{' '}
          <span className=" text-primary">CHATBOT</span> &mdash;
          All Rights Reserved
        </p>
      </div>
    </footer>
  )
}

export default Footer
