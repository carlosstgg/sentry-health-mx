-- Datos de prueba — NO usar en producción
-- Simula registros biométricos para el arquetipo Carmen (glucosa con patrones de diabetes tipo 2)
insert into public.biometric_records (user_id, glucose_mg_dl, systolic_bp, diastolic_bp, heart_rate, recorded_at)
values
  ('00000000-0000-0000-0000-000000000001', 187.5, 138, 88, 78, now() - interval '1 day'),
  ('00000000-0000-0000-0000-000000000001', 210.3, 142, 91, 82, now() - interval '12 hours'),
  ('00000000-0000-0000-0000-000000000001', 156.8, 135, 85, 75, now() - interval '6 hours'),
  ('00000000-0000-0000-0000-000000000001', 263.1, 150, 95, 88, now() - interval '2 hours');
