import UserInformation from "@/components/UserInformation";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid">
      <section>
        <UserInformation />
      </section>

      <section>
        {/* post form */}
        <p>post form</p>
      </section>

      <section>
        {/* right widget */}
        <p>right widget</p>
      </section>
    </div>
  );
}
