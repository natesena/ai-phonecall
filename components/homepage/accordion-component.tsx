import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AccordionComponent() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-6">
      <h2
        className={`mt-2 font-semibold text-center tracking-tight dark:text-white text-white`}
      >
        Frequently Asked Questions (FAQs)
      </h2>
      <Accordion type="single" collapsible className="w-full mt-2">
        <AccordionItem value="item-1" className="w-full">
          <AccordionTrigger className="w-full">
            <span className="font-medium accordion-question">
              Can I send my credit to someone else?
            </span>
          </AccordionTrigger>
          <AccordionContent className="w-full">
            <p className="accordion-answer">
              Unfortunately not at this time. If you wish for a loved one to
              talk to Santa, please make sure to sign up with the phone number
              that they will be able to use for their chat with Santa.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-1" className="w-full">
          <AccordionTrigger className="w-full">
            <span className="font-medium accordion-question">
              Can I call Santa at any time?
            </span>
          </AccordionTrigger>
          <AccordionContent className="w-full">
            <p className="accordion-answer">
              Yes, Santa works day and night and is always available to answer
              your call
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-1" className="w-full">
          <AccordionTrigger className="w-full">
            <span className="font-mediumn accordion-question">
              Will I get access to a recording of the call?
            </span>
          </AccordionTrigger>
          <AccordionContent className="w-full">
            <p className="accordion-answer">
              Yes, there is a &quot;calls&quot; section in the dashboard where
              you can read the transcript and download a .wav file of your call.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
