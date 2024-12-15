import { Button } from "@/components/ui/button";
import NavBar from "@/components/wrapper/navbar";
import Link from "next/link";
import { Home, Heart } from "lucide-react";

export default function Cancel() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-full h-full animate-fall opacity-70 bg-[length:700px_700px]"
          style={{
            backgroundImage: `radial-gradient(2px 2px at 40px 60px, #fff, transparent),
              radial-gradient(2px 2px at 20px 50px, #fff, transparent),
              radial-gradient(2px 2px at 30px 100px, #fff, transparent),
              radial-gradient(2px 2px at 40px 60px, #fff, transparent),
              radial-gradient(4px 4px at 110px 90px, #fff, transparent),
              radial-gradient(2px 2px at 190px 150px, #fff, transparent),
              radial-gradient(3px 3px at 220px 220px, #fff, transparent),
              radial-gradient(2px 2px at 280px 120px, #fff, transparent),
              radial-gradient(2px 2px at 320px 180px, #fff, transparent),
              radial-gradient(3px 3px at 380px 230px, #fff, transparent),
              radial-gradient(2px 2px at 400px 200px, #fff, transparent),
              radial-gradient(5px 5px at 450px 260px, #fff, transparent),
              radial-gradient(2px 2px at 500px 140px, #fff, transparent),
              radial-gradient(3px 3px at 580px 290px, #fff, transparent)`,
          }}
        />
        <div
          className="absolute w-full h-full animate-fall-slow opacity-70 bg-[length:700px_700px]"
          style={{
            backgroundImage: `radial-gradient(2px 2px at 100px 80px, #fff, transparent),
              radial-gradient(2px 2px at 160px 120px, #fff, transparent),
              radial-gradient(3px 3px at 200px 150px, #fff, transparent),
              radial-gradient(5px 5px at 260px 220px, #fff, transparent),
              radial-gradient(2px 2px at 300px 180px, #fff, transparent),
              radial-gradient(3px 3px at 350px 230px, #fff, transparent),
              radial-gradient(2px 2px at 420px 280px, #fff, transparent),
              radial-gradient(3px 3px at 480px 320px, #fff, transparent),
              radial-gradient(2px 2px at 520px 260px, #fff, transparent),
              radial-gradient(3px 3px at 550px 340px, #fff, transparent)`,
          }}
        />
      </div>
      <NavBar />
      <div className="flex flex-col items-center justify-center flex-grow max-w-2xl mx-auto px-4 text-center">
        <div className="space-y-6">
          <div className="text-8xl animate-bounce mb-8">🎅</div>

          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl text-red-600">
            Ho Ho Hold On!
          </h1>

          <div className="space-y-4">
            <p className="text-xl leading-7 text-white">
              Don&apos;t worry, you&apos;re definitely{" "}
              <span className="font-semibold text-green-600">
                not on the naughty list!
              </span>
            </p>

            <p className="text-lg leading-7 text-white">
              Feeling a bit shy about talking to Santa? That&apos;s okay! Even
              the elves get butterflies sometimes. Santa&apos;s just a jolly old
              fellow who loves spreading Christmas cheer!
            </p>

            <p className="text-lg leading-7 text-white">
              Ready to give it another try? The reindeer are waiting!{" "}
              <span className="text-2xl">🦌✨</span>
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Link href="/">
              <Button
                variant="default"
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
