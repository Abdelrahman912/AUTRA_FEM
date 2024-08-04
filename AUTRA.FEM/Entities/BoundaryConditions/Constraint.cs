using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AUTRA.FEM.Entities.BoundaryConditions
{
    public class Constraint
    {
        public bool[] Free { get; }
        public bool IsUxFree => Free[0];
        public bool IsUyFree => Free[1];
        public bool IsUzFree => Free[2];

        public Constraint(bool u1, bool u2, bool u3)
        {
            Free = new bool[3] { u1, u2, u3 };
        }

        public Constraint()
        {
            Free = new bool[3] { true, true, true };
        }

        override public string ToString()
        {
            Func<bool, string> f = (b) => b ? "free" : "fixed";
            return $"Ux: {f(IsUxFree)}, Uy: {f(IsUyFree)}, Uz: {f(IsUzFree)}";
        }
    }
}
