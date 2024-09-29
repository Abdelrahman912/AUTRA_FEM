using System;

namespace AUTRA.FEM.Entities.BoundaryConditions.Constraints
{
    public class Constraint2D : Constraint
    {
        public bool IsUxFree => Free[0];
        public bool IsUyFree => Free[1];

        public Constraint2D(bool u1, bool u2)
            : base(new bool[2] { u1, u2 })
        {
        }

        public Constraint2D()
            : base(new bool[2] { true, true })
        {
        }

        override public string ToString()
        {
            Func<bool, string> f = (b) => b ? "free" : "fixed";
            return $"Ux: {f(IsUxFree)}, Uy: {f(IsUyFree)}";
        }
    }
}
