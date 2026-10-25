import type { Children } from "@alloy-js/core";
import { For, refkey } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { useTransformNamePolicy, useTsp } from "@typespec/emitter-framework";
import { TypeExpression } from "@typespec/emitter-framework/typescript";
import type * as cl from "@typespec/http-client";
import { httpRuntimeTemplateLib } from "../external-packages/ts-http-runtime.js";

export interface ClientContextOptionsDeclarationProps {
  client: cl.Client;
}

export function getClientContextOptionsRef(client: cl.Client) {
  return refkey(client, "options");
}

export function ClientContextOptionsDeclaration(props: ClientContextOptionsDeclarationProps) {
  const { $ } = useTsp();
  const propNamer = useTransformNamePolicy();
  const ref = getClientContextOptionsRef(props.client);
  const namePolicy = ts.useTSNamePolicy();
  const name = namePolicy.getName(`${props.client.name}Options`, "interface");

  // Retain the existing endpoint option and add the optional URL parameters read by the factory.
  const clientOptions: Map<string, Children> = new Map([["endpoint", "string"]]);
  for (const parameter of $.client.getUrlTemplate(props.client).parameters) {
    if (parameter.optional) {
      clientOptions.set(
        propNamer.getApplicationName(parameter),
        <TypeExpression type={parameter.type} />,
      );
    }
  }

  return (
    <ts.InterfaceDeclaration
      export
      name={name}
      refkey={ref}
      extends={<ts.Reference refkey={httpRuntimeTemplateLib.ClientOptions} />}
    >
      <For each={Array.from(clientOptions.entries())} semicolon line>
        {([key, value]) => <ts.InterfaceMember optional name={key} type={value} />}
      </For>
    </ts.InterfaceDeclaration>
  );
}
