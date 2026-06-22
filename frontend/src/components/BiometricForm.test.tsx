import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import BiometricForm from "@/components/BiometricForm";

describe("BiometricForm", () => {
  it("muestra etiquetas accesibles para cada campo del registro", () => {
    render(<BiometricForm onSubmit={jest.fn()} />);

    expect(screen.getByLabelText(/glucosa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/presión sistólica/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/presión diastólica/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/frecuencia cardiaca/i)).toBeInTheDocument();
  });

  it("muestra un error en español y no envía el formulario si falta un campo obligatorio", async () => {
    const onSubmit = jest.fn();
    render(<BiometricForm onSubmit={onSubmit} />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /guardar registro/i }));
    });

    expect(
      await screen.findByText(/glucosa es obligatorio/i),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("envía el registro y muestra confirmación cuando los valores son válidos", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<BiometricForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/glucosa/i), { target: { value: "110" } });
    fireEvent.change(screen.getByLabelText(/presión sistólica/i), { target: { value: "120" } });
    fireEvent.change(screen.getByLabelText(/presión diastólica/i), { target: { value: "80" } });
    fireEvent.change(screen.getByLabelText(/frecuencia cardiaca/i), { target: { value: "70" } });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /guardar registro/i }));
    });

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({
      glucoseMgDl: 110,
      systolicBp: 120,
      diastolicBp: 80,
      heartRate: 70,
      notes: undefined,
    }));
    expect(
      await screen.findByText(/tu registro se guardó correctamente/i),
    ).toBeInTheDocument();
  });
});
