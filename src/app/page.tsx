import Hero from "@/components/layout/Hero";
import HomeMenu from "@/components/layout/HomeMenu";
import SectionHeader from "@/components/layout/SectionHeader";

export default function Home() {
  return (
    <>
      <Hero />
      <HomeMenu />
      <section className="text-center my-16">
        <SectionHeader 
          subHeader={"Our story"} 
          mainHeader={"About us"} 
        />
        <div className="text-gray-500 max-w-md mx-auto mt-4 flex flex-col gap-4">
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat molestias corrupti non deserunt saepe. At, eos? Eum iste quam nihil assumenda dolore numquam sequi placeat, ad, consectetur laudantium nisi ipsa?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque impedit aut omnis mollitia atque tempora inventore rem a, deleniti nihil reiciendis tempore voluptas.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem officiis adipisci nemo alias aut nobis 
          </p>
        </div>
      </section>
      <section className="text-center">
        <SectionHeader
          subHeader={"Don't hesitate"}
          mainHeader={"Contact us"}
        />
        <div className="mt-4">
          <a className="text-4xl underline text-gray-500" href="tel:+84959329378">
            +84 959 329 378
          </a>
        </div>
      </section>
    </>
  )
}