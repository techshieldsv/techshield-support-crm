insert into public.companies (id, name, website, phone) values
  ('11111111-1111-1111-1111-111111111111', 'Grupo Cuscatlan', 'https://example.com', '+503 2222-0101'),
  ('22222222-2222-2222-2222-222222222222', 'Retail San Miguel', 'https://example.com', '+503 2660-0202')
on conflict do nothing;

insert into public.contacts (company_id, full_name, email, phone, position) values
  ('11111111-1111-1111-1111-111111111111', 'Ana Martinez', 'ana@example.com', '+503 7000-0101', 'Gerente administrativa'),
  ('22222222-2222-2222-2222-222222222222', 'Mario Lopez', 'mario@example.com', '+503 7000-0202', 'Encargado de tienda');

insert into public.knowledge_base (title, slug, content, visibility, tags, published_at) values
  ('Como reportar incidentes criticos', 'reportar-incidentes-criticos', 'Use prioridad urgente solo cuando exista impacto operativo total o riesgo de seguridad.', 'public', array['soporte','sla'], now()),
  ('Politica de respaldos y restauracion', 'politica-respaldos-restauracion', 'Los respaldos se validan mensualmente y se restauran bajo solicitud autorizada.', 'internal', array['backup','seguridad'], now());
